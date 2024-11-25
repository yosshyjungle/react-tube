import { Home, Compass, Clock, ThumbsUp, PlaySquare, History, Film, Flame, Music2, Gamepad2, Newspaper, Trophy, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const primaryMenuItems = [
    { icon: Home, label: 'ホーム' },
    { icon: Compass, label: '探索' },
    { icon: Clock, label: 'ショート' },
    { icon: PlaySquare, label: '登録チャンネル' },
  ];

  const libraryItems = [
    { icon: History, label: '履歴' },
    { icon: ThumbsUp, label: '高く評価した動画' },
  ];

  const exploreItems = [
    { icon: Flame, label: '急上昇' },
    { icon: Music2, label: '音楽' },
    { icon: Film, label: '映画' },
    { icon: Gamepad2, label: 'ゲーム' },
    { icon: Newspaper, label: 'ニュース' },
    { icon: Trophy, label: 'スポーツ' },
    { icon: Lightbulb, label: '学び' },
  ];

  const renderMenuItem = (item: { icon: any; label: string }) => (
    <Button
      key={item.label}
      variant="ghost"
      className={cn(
        'w-full justify-start gap-4 h-10',
        !isOpen && 'justify-center px-0'
      )}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {isOpen && <span className="truncate">{item.label}</span>}
    </Button>
  );

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r transition-all duration-300',
        isOpen ? 'w-60' : 'w-[70px]'
      )}
    >
      <ScrollArea className="h-full">
        <nav className="p-2">
          <div className="space-y-1">
            {primaryMenuItems.map(renderMenuItem)}
          </div>

          {isOpen && <Separator className="my-4" />}

          <div className="space-y-1">
            {libraryItems.map(renderMenuItem)}
          </div>

          {isOpen && (
            <>
              <Separator className="my-4" />
              <div className="mb-2 px-3 text-sm font-semibold text-muted-foreground">
                探索
              </div>
              <div className="space-y-1">
                {exploreItems.map(renderMenuItem)}
              </div>
            </>
          )}
        </nav>
      </ScrollArea>
    </aside>
  );
}