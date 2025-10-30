import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DOTA_ITEMS, getItemImageUrl } from '@/data/items';
import Icon from '@/components/ui/icon';

interface ItemSelectorProps {
  onItemSelect: (itemId: string, timing: string) => void;
}

export default function ItemSelector({ onItemSelect }: ItemSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [timing, setTiming] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const filteredItems = DOTA_ITEMS.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedItem) {
      onItemSelect(selectedItem, timing);
      setOpen(false);
      setTiming('');
      setSelectedItem(null);
      setSearch('');
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="border-primary/50 hover:bg-primary/10"
      >
        <Icon name="Plus" size={16} className="mr-2" />
        Добавить предмет
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl bg-card border-primary">
          <DialogHeader>
            <DialogTitle>Выбрать предмет</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Поиск предмета..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background border-primary/30"
            />

            <ScrollArea className="h-[400px] rounded-lg border border-primary/20 p-4">
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item.id)}
                    className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      selectedItem === item.id
                        ? 'border-primary shadow-lg shadow-primary/50'
                        : 'border-primary/20 hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={getItemImageUrl(item.id)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <p className="text-xs text-white font-semibold leading-tight">{item.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>

            {selectedItem && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/30">
                  <img
                    src={getItemImageUrl(selectedItem)}
                    alt="Selected item"
                    className="w-16 h-16 rounded border-2 border-primary"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">
                      {DOTA_ITEMS.find(i => i.id === selectedItem)?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {DOTA_ITEMS.find(i => i.id === selectedItem)?.cost} золота
                    </p>
                  </div>
                </div>

                <Input
                  placeholder="Тайминг (например: 10 мин, Early game)"
                  value={timing}
                  onChange={(e) => setTiming(e.target.value)}
                  className="bg-background border-primary/30"
                />

                <Button
                  onClick={handleSelect}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                >
                  Добавить
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
