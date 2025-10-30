import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SkillBuilderProps {
  onSkillsChange: (skills: string[]) => void;
  initialSkills?: string[];
}

const SKILL_SLOTS = ['Q', 'W', 'E', 'R', 'T1', 'T2', 'T3', 'T4'];
const MAX_LEVEL = 30;

export default function SkillBuilder({ onSkillsChange, initialSkills = [] }: SkillBuilderProps) {
  const [skillBuild, setSkillBuild] = useState<string[]>(initialSkills);
  const [selectedSkill, setSelectedSkill] = useState<string>('Q');

  const addSkillAtLevel = (level: number) => {
    const newBuild = [...skillBuild];
    newBuild[level - 1] = selectedSkill;
    setSkillBuild(newBuild);
    onSkillsChange(newBuild);
  };

  const removeSkillAtLevel = (level: number) => {
    const newBuild = [...skillBuild];
    newBuild.splice(level - 1, 1);
    setSkillBuild(newBuild);
    onSkillsChange(newBuild);
  };

  const getSkillColor = (skill: string) => {
    if (skill.startsWith('T')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    switch (skill) {
      case 'Q': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'W': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'E': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'R': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {SKILL_SLOTS.map((skill) => (
          <Button
            key={skill}
            onClick={() => setSelectedSkill(skill)}
            variant={selectedSkill === skill ? 'default' : 'outline'}
            className={`min-w-[60px] ${
              selectedSkill === skill
                ? 'bg-gradient-to-r from-primary to-secondary'
                : 'border-primary/50'
            }`}
          >
            {skill}
          </Button>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-background/50 border border-primary/20">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).map((level) => (
            <div key={level} className="flex flex-col items-center gap-1">
              <div className="text-xs text-muted-foreground font-semibold">{level}</div>
              {skillBuild[level - 1] ? (
                <button
                  onClick={() => removeSkillAtLevel(level)}
                  className={`w-10 h-10 rounded border-2 flex items-center justify-center font-bold text-sm transition-all hover:scale-110 ${getSkillColor(
                    skillBuild[level - 1]
                  )}`}
                >
                  {skillBuild[level - 1]}
                </button>
              ) : (
                <button
                  onClick={() => addSkillAtLevel(level)}
                  className="w-10 h-10 rounded border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <Icon name="Plus" size={16} className="mx-auto text-primary/50" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {skillBuild.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-semibold">Порядок прокачки:</span>
          {skillBuild.map((skill, i) => (
            <Badge key={i} variant="outline" className={`${getSkillColor(skill)}`}>
              {i + 1}: {skill}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
