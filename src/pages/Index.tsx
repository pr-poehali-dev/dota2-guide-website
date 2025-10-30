import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface Hero {
  id: number;
  name: string;
  image: string;
  attribute: 'strength' | 'agility' | 'intelligence' | 'universal';
}

interface Guide {
  id: number;
  heroId: number;
  heroName: string;
  author: string;
  skills: string[];
  items: Array<{ name: string; timing: string }>;
  description: string;
  comments: Array<{ author: string; text: string; rating: number }>;
  rating: number;
  createdAt: string;
}

const SAMPLE_HEROES: Hero[] = [
  { id: 1, name: 'Pudge', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png', attribute: 'strength' },
  { id: 2, name: 'Invoker', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/invoker.png', attribute: 'intelligence' },
  { id: 3, name: 'Anti-Mage', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/antimage.png', attribute: 'agility' },
  { id: 4, name: 'Crystal Maiden', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/crystal_maiden.png', attribute: 'intelligence' },
  { id: 5, name: 'Juggernaut', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png', attribute: 'agility' },
  { id: 6, name: 'Axe', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/axe.png', attribute: 'strength' },
  { id: 7, name: 'Lina', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/lina.png', attribute: 'intelligence' },
  { id: 8, name: 'Shadow Fiend', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/nevermore.png', attribute: 'agility' },
  { id: 9, name: 'Earthshaker', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/earthshaker.png', attribute: 'strength' },
  { id: 10, name: 'Drow Ranger', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/drow_ranger.png', attribute: 'agility' },
  { id: 11, name: 'Phantom Assassin', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/phantom_assassin.png', attribute: 'agility' },
  { id: 12, name: 'Zeus', image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/zuus.png', attribute: 'intelligence' },
];

const API_URL = 'https://functions.poehali.dev/e18002ef-9e28-45c5-ad6f-9878c671a1ae';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreatingGuide, setIsCreatingGuide] = useState(false);
  const [newGuide, setNewGuide] = useState({
    author: '',
    skills: '',
    items: '',
    description: ''
  });
  const [newComment, setNewComment] = useState({ author: '', text: '', rating: 5 });
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const parsedGuides = data.guides.map((g: any) => ({
        id: g.id,
        heroId: g.heroId,
        heroName: g.heroName,
        author: g.author,
        skills: g.skills ? g.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        items: g.items ? g.items.split('\n').filter(Boolean).map((line: string) => {
          const [name, timing] = line.split('|').map((s: string) => s.trim());
          return { name, timing: timing || '' };
        }) : [],
        description: g.description || '',
        comments: g.comments || [],
        rating: 0,
        createdAt: g.createdAt
      }));
      setGuides(parsedGuides);
    } catch (error) {
      console.error('Error loading guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHeroes = SAMPLE_HEROES.filter(hero =>
    hero.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGuide = async () => {
    if (!selectedHero || !newGuide.author) return;

    setLoading(true);
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_guide',
          heroId: selectedHero.id,
          heroName: selectedHero.name,
          author: newGuide.author,
          skills: newGuide.skills,
          items: newGuide.items,
          description: newGuide.description
        })
      });
      await loadGuides();
      setIsCreatingGuide(false);
      setNewGuide({ author: '', skills: '', items: '', description: '' });
    } catch (error) {
      console.error('Error creating guide:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (guideId: number) => {
    if (!newComment.author || !newComment.text) return;

    setLoading(true);
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_comment',
          guideId,
          author: newComment.author,
          text: newComment.text,
          rating: newComment.rating
        })
      });
      await loadGuides();
      setNewComment({ author: '', text: '', rating: 5 });
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const heroGuides = selectedHero ? guides.filter(g => g.heroId === selectedHero.id) : [];

  const getAttributeColor = (attr: string) => {
    switch (attr) {
      case 'strength': return 'text-red-400';
      case 'agility': return 'text-green-400';
      case 'intelligence': return 'text-blue-400';
      default: return 'text-purple-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2c] via-[#1e2436] to-[#252d42]">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Dota 2 Guides Hub ⚔️
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">Создавай и изучай лучшие гайды по героям</p>
        </header>

        {!selectedHero ? (
          <div className="animate-scale-in">
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="relative">
                <Icon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Поиск героя..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-card border-primary/30 focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {filteredHeroes.map((hero, index) => (
                <Card
                  key={hero.id}
                  className="group cursor-pointer overflow-hidden bg-card/50 backdrop-blur border-primary/20 hover:border-primary transition-all duration-300 hover-scale"
                  onClick={() => setSelectedHero(hero)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={hero.image}
                      alt={hero.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-bold text-white text-sm mb-1">{hero.name}</h3>
                      <Badge className={`${getAttributeColor(hero.attribute)} bg-black/50 border-0`}>
                        {hero.attribute}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
              <Button variant="outline" onClick={() => setSelectedHero(null)} className="border-primary/50">
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад
              </Button>
              <div className="flex items-center gap-3">
                <img src={selectedHero.image} alt={selectedHero.name} className="w-16 h-16 rounded-lg border-2 border-primary" />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{selectedHero.name}</h2>
                  <Badge className={`${getAttributeColor(selectedHero.attribute)} bg-black/50 border-0`}>
                    {selectedHero.attribute}
                  </Badge>
                </div>
              </div>
              <Button onClick={() => setIsCreatingGuide(true)} className="md:ml-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Icon name="Plus" size={20} className="mr-2" />
                Создать гайд
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {heroGuides.length === 0 ? (
                <Card className="col-span-full p-12 text-center bg-card/50 backdrop-blur border-primary/20">
                  <Icon name="BookOpen" size={64} className="mx-auto mb-4 text-primary opacity-50" />
                  <h3 className="text-2xl font-bold mb-2">Гайдов пока нет</h3>
                  <p className="text-muted-foreground mb-4">Будь первым, кто создаст гайд для {selectedHero.name}!</p>
                  <Button onClick={() => setIsCreatingGuide(true)} className="bg-gradient-to-r from-primary to-secondary">
                    Создать первый гайд
                  </Button>
                </Card>
              ) : (
                heroGuides.map((guide) => (
                  <Card key={guide.id} className="p-6 bg-card/50 backdrop-blur border-primary/20 hover:border-primary transition-all hover-scale">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">Гайд от {guide.author}</h3>
                        <p className="text-sm text-muted-foreground">{guide.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-bold">{guide.comments.length > 0 ? (guide.comments.reduce((acc, c) => acc + c.rating, 0) / guide.comments.length).toFixed(1) : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {guide.skills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-primary mb-2">⚡ Прокачка скиллов:</h4>
                          <div className="flex flex-wrap gap-2">
                            {guide.skills.map((skill, i) => (
                              <Badge key={i} variant="outline" className="border-primary/50">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {guide.items.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-secondary mb-2">🎯 Предметы:</h4>
                          <div className="space-y-1">
                            {guide.items.map((item, i) => (
                              <div key={i} className="text-sm flex justify-between">
                                <span className="text-foreground">{item.name}</span>
                                {item.timing && <span className="text-muted-foreground">{item.timing}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {guide.description && (
                        <div>
                          <h4 className="text-sm font-semibold text-accent mb-2">📖 Описание:</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{guide.description}</p>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setSelectedGuide(guide)}
                      className="w-full border-primary/50 hover:bg-primary/10"
                    >
                      <Icon name="MessageSquare" size={16} className="mr-2" />
                      Комментарии ({guide.comments.length})
                    </Button>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isCreatingGuide} onOpenChange={setIsCreatingGuide}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-primary">
          <DialogHeader>
            <DialogTitle className="text-2xl">Создать гайд для {selectedHero?.name}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="skills">⚡ Скиллы</TabsTrigger>
              <TabsTrigger value="items">🎯 Предметы</TabsTrigger>
              <TabsTrigger value="description">📖 Описание</TabsTrigger>
            </TabsList>

            <TabsContent value="skills" className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Ваш никнейм</label>
                <Input
                  placeholder="Введите ваш ник"
                  value={newGuide.author}
                  onChange={(e) => setNewGuide({ ...newGuide, author: e.target.value })}
                  className="bg-background border-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Порядок прокачки (через запятую)</label>
                <Textarea
                  placeholder="Q, W, Q, E, Q, R, Q, W, W, W, R, E, E, E, R..."
                  value={newGuide.skills}
                  onChange={(e) => setNewGuide({ ...newGuide, skills: e.target.value })}
                  className="min-h-[120px] bg-background border-primary/30"
                />
                <p className="text-xs text-muted-foreground mt-2">Укажите порядок прокачки способностей и талантов</p>
              </div>
            </TabsContent>

            <TabsContent value="items" className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Предметы и тайминги</label>
                <Textarea
                  placeholder="Power Treads | 5 мин&#10;Battle Fury | 12-15 мин&#10;Manta Style | 20 мин"
                  value={newGuide.items}
                  onChange={(e) => setNewGuide({ ...newGuide, items: e.target.value })}
                  className="min-h-[200px] bg-background border-primary/30 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">Формат: Предмет | Тайминг (каждый с новой строки)</p>
              </div>
            </TabsContent>

            <TabsContent value="description" className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Стратегия и советы ⚡</label>
                <Textarea
                  placeholder="Опишите стратегию игры, позиционирование на карте, комбо способностей...&#10;&#10;Используйте эмодзи для оформления! 🎯 🔥 ⚔️ 🛡️ 💪"
                  value={newGuide.description}
                  onChange={(e) => setNewGuide({ ...newGuide, description: e.target.value })}
                  className="min-h-[250px] bg-background border-primary/30"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsCreatingGuide(false)} className="flex-1">
              Отмена
            </Button>
            <Button
              onClick={handleCreateGuide}
              disabled={!newGuide.author}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Icon name="Save" size={16} className="mr-2" />
              Опубликовать гайд
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-primary">
          <DialogHeader>
            <DialogTitle className="text-2xl">Обсуждение гайда</DialogTitle>
          </DialogHeader>

          {selectedGuide && (
            <div className="space-y-6">
              <div className="space-y-4">
                {selectedGuide.comments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Комментариев пока нет. Будь первым!</p>
                ) : (
                  selectedGuide.comments.map((comment, i) => (
                    <Card key={i} className="p-4 bg-background/50 border-primary/20">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold">{comment.author}</span>
                        <div className="flex items-center gap-1">
                          <Icon name="Star" size={14} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-sm">{comment.rating}/5</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.text}</p>
                    </Card>
                  ))
                )}
              </div>

              <div className="border-t border-primary/20 pt-6 space-y-4">
                <h3 className="font-semibold">Добавить комментарий</h3>
                <Input
                  placeholder="Ваш никнейм"
                  value={newComment.author}
                  onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                  className="bg-background border-primary/30"
                />
                <Textarea
                  placeholder="Ваш отзыв о гайде..."
                  value={newComment.text}
                  onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                  className="bg-background border-primary/30"
                />
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold">Оценка:</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setNewComment({ ...newComment, rating })}
                        className="transition-transform hover:scale-110"
                      >
                        <Icon
                          name="Star"
                          size={24}
                          className={rating <= newComment.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => {
                    handleAddComment(selectedGuide.id);
                    setSelectedGuide(null);
                  }}
                  disabled={!newComment.author || !newComment.text}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                >
                  Отправить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}