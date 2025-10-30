import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import ItemSelector from '@/components/ItemSelector';
import SkillBuilder from '@/components/SkillBuilder';
import { DOTA_HEROES, getHeroImageUrl, Hero } from '@/data/heroes';
import { getItemImageUrl } from '@/data/items';

interface Guide {
  id: number;
  heroId: number;
  heroName: string;
  author: string;
  skills: string[];
  items: Array<{ itemId: string; timing: string }>;
  description: string;
  facet?: string;
  comments: Array<{ author: string; text: string; rating: number }>;
  rating: number;
  createdAt: string;
}

const API_URL = 'https://functions.poehali.dev/e18002ef-9e28-45c5-ad6f-9878c671a1ae';

const FACETS: Record<number, string[]> = {
  1: ['Mana Break', 'Agility Bonus'],
  14: ['Flesh Heap', 'Rot Damage'],
  74: ['Quas Focus', 'Wex Focus', 'Exort Focus'],
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [attributeFilter, setAttributeFilter] = useState<string>('all');
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreatingGuide, setIsCreatingGuide] = useState(false);
  const [newGuide, setNewGuide] = useState({
    author: '',
    skills: [] as string[],
    items: [] as Array<{ itemId: string; timing: string }>,
    description: '',
    facet: ''
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
        items: g.items ? JSON.parse(g.items || '[]') : [],
        description: g.description || '',
        facet: g.facet || '',
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

  const filteredHeroes = DOTA_HEROES.filter(hero => {
    const matchesSearch = hero.localized_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAttribute = attributeFilter === 'all' || hero.primary_attr === attributeFilter;
    return matchesSearch && matchesAttribute;
  });

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
          heroName: selectedHero.localized_name,
          author: newGuide.author,
          skills: newGuide.skills.join(','),
          items: JSON.stringify(newGuide.items),
          description: newGuide.description,
          facet: newGuide.facet
        })
      });
      await loadGuides();
      setIsCreatingGuide(false);
      setNewGuide({ author: '', skills: [], items: [], description: '', facet: '' });
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
      case 'str': return 'text-red-400 border-red-400/50';
      case 'agi': return 'text-green-400 border-green-400/50';
      case 'int': return 'text-blue-400 border-blue-400/50';
      case 'all': return 'text-purple-400 border-purple-400/50';
      default: return 'text-gray-400 border-gray-400/50';
    }
  };

  const getAttributeIcon = (attr: string) => {
    switch (attr) {
      case 'str': return '💪';
      case 'agi': return '⚡';
      case 'int': return '🧠';
      case 'all': return '✨';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2c] via-[#1e2436] to-[#252d42]">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent tracking-wider">
            DOTA 2 GUIDES HUB ⚔️
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">Создавай и изучай лучшие гайды по героям</p>
        </header>

        {!selectedHero ? (
          <div className="animate-scale-in space-y-6">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="relative">
                <Icon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Поиск героя..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-card border-primary/30 focus:border-primary"
                />
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={() => setAttributeFilter('all')}
                  variant={attributeFilter === 'all' ? 'default' : 'outline'}
                  className={attributeFilter === 'all' ? 'bg-gradient-to-r from-primary to-secondary' : 'border-primary/50'}
                >
                  Все герои ({DOTA_HEROES.length})
                </Button>
                <Button
                  onClick={() => setAttributeFilter('str')}
                  variant={attributeFilter === 'str' ? 'default' : 'outline'}
                  className={attributeFilter === 'str' ? 'bg-red-600' : 'border-red-400/50 text-red-400'}
                >
                  💪 Сила ({DOTA_HEROES.filter(h => h.primary_attr === 'str').length})
                </Button>
                <Button
                  onClick={() => setAttributeFilter('agi')}
                  variant={attributeFilter === 'agi' ? 'default' : 'outline'}
                  className={attributeFilter === 'agi' ? 'bg-green-600' : 'border-green-400/50 text-green-400'}
                >
                  ⚡ Ловкость ({DOTA_HEROES.filter(h => h.primary_attr === 'agi').length})
                </Button>
                <Button
                  onClick={() => setAttributeFilter('int')}
                  variant={attributeFilter === 'int' ? 'default' : 'outline'}
                  className={attributeFilter === 'int' ? 'bg-blue-600' : 'border-blue-400/50 text-blue-400'}
                >
                  🧠 Интеллект ({DOTA_HEROES.filter(h => h.primary_attr === 'int').length})
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {filteredHeroes.map((hero, index) => (
                <Card
                  key={hero.id}
                  className="group cursor-pointer overflow-hidden bg-card/50 backdrop-blur border-primary/20 hover:border-primary transition-all duration-300 hover-scale animate-fade-in"
                  onClick={() => setSelectedHero(hero)}
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={getHeroImageUrl(hero.name)}
                      alt={hero.localized_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <h3 className="font-bold text-white text-xs mb-1 leading-tight">{hero.localized_name}</h3>
                      <Badge className={`${getAttributeColor(hero.primary_attr)} bg-black/60 border text-[10px] px-1 py-0`}>
                        {getAttributeIcon(hero.primary_attr)}
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
                <img
                  src={getHeroImageUrl(selectedHero.name)}
                  alt={selectedHero.localized_name}
                  className="w-20 h-20 rounded-lg border-2 border-primary shadow-lg shadow-primary/30"
                />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-wide">{selectedHero.localized_name}</h2>
                  <div className="flex gap-2 items-center mt-1">
                    <Badge className={`${getAttributeColor(selectedHero.primary_attr)} bg-black/50 border`}>
                      {getAttributeIcon(selectedHero.primary_attr)} {selectedHero.primary_attr.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="border-primary/30">{selectedHero.attack_type}</Badge>
                  </div>
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
                  <p className="text-muted-foreground mb-4">Будь первым, кто создаст гайд для {selectedHero.localized_name}!</p>
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
                        {guide.facet && (
                          <Badge variant="outline" className="mt-2 border-secondary/50 text-secondary">
                            🎭 {guide.facet}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-bold">{guide.comments.length > 0 ? (guide.comments.reduce((acc, c) => acc + c.rating, 0) / guide.comments.length).toFixed(1) : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {guide.skills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-primary mb-2">⚡ Прокачка:</h4>
                          <div className="flex flex-wrap gap-1">
                            {guide.skills.slice(0, 15).map((skill, i) => (
                              <Badge key={i} variant="outline" className="border-primary/50 text-xs px-1.5 py-0">{i + 1}:{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {guide.items && guide.items.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-secondary mb-2">🎯 Предметы:</h4>
                          <div className="flex flex-wrap gap-2">
                            {guide.items.map((item, i) => (
                              <div key={i} className="flex flex-col items-center gap-1">
                                <img
                                  src={getItemImageUrl(item.itemId)}
                                  alt={item.itemId}
                                  className="w-12 h-9 rounded border border-primary/30 hover:border-primary transition-all"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                                  }}
                                />
                                {item.timing && <span className="text-[10px] text-muted-foreground">{item.timing}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {guide.description && (
                        <div>
                          <h4 className="text-sm font-semibold text-accent mb-2">📖 Описание:</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">{guide.description}</p>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-primary">
          <DialogHeader>
            <DialogTitle className="text-2xl">Создать гайд для {selectedHero?.localized_name}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="info">Инфо</TabsTrigger>
              <TabsTrigger value="skills">⚡ Скиллы</TabsTrigger>
              <TabsTrigger value="items">🎯 Предметы</TabsTrigger>
              <TabsTrigger value="description">📖 Описание</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Ваш никнейм</label>
                <Input
                  placeholder="Введите ваш ник"
                  value={newGuide.author}
                  onChange={(e) => setNewGuide({ ...newGuide, author: e.target.value })}
                  className="bg-background border-primary/30"
                />
              </div>

              {selectedHero && FACETS[selectedHero.id] && (
                <div>
                  <label className="text-sm font-semibold mb-2 block">🎭 Выбор аспекта</label>
                  <Select value={newGuide.facet} onValueChange={(value) => setNewGuide({ ...newGuide, facet: value })}>
                    <SelectTrigger className="bg-background border-primary/30">
                      <SelectValue placeholder="Выберите аспект героя" />
                    </SelectTrigger>
                    <SelectContent>
                      {FACETS[selectedHero.id].map((facet) => (
                        <SelectItem key={facet} value={facet}>{facet}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">Аспект влияет на стиль игры героя</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <SkillBuilder
                onSkillsChange={(skills) => setNewGuide({ ...newGuide, skills })}
                initialSkills={newGuide.skills}
              />
            </TabsContent>

            <TabsContent value="items" className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">Сборка предметов</h3>
                
                {newGuide.items.length > 0 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-4 p-4 bg-background/50 rounded-lg border border-primary/20">
                    {newGuide.items.map((item, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={getItemImageUrl(item.itemId)}
                          alt={item.itemId}
                          className="w-full aspect-square rounded border-2 border-primary/30"
                        />
                        <button
                          onClick={() => setNewGuide({ ...newGuide, items: newGuide.items.filter((_, idx) => idx !== i) })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        {item.timing && <p className="text-xs text-center mt-1 text-muted-foreground">{item.timing}</p>}
                      </div>
                    ))}
                  </div>
                )}

                <ItemSelector
                  onItemSelect={(itemId, timing) => {
                    setNewGuide({ ...newGuide, items: [...newGuide.items, { itemId, timing }] });
                  }}
                />
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
              disabled={!newGuide.author || loading}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Icon name="Save" size={16} className="mr-2" />
              {loading ? 'Сохранение...' : 'Опубликовать гайд'}
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
                  disabled={!newComment.author || !newComment.text || loading}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                >
                  {loading ? 'Отправка...' : 'Отправить'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
