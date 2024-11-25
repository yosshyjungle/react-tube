import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { VideoPlayer } from './VideoPlayer';
import { Button } from './ui/button';
import { ThumbsUp, ThumbsDown, Share2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  createdAt: Date;
  views: number;
  likes: number;
  channelId: string;
}

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const { user } = useAuth();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return '今日';
    if (days === 1) return '昨日';
    if (days < 7) return `${days}日前`;
    if (days < 30) return `${Math.floor(days / 7)}週間前`;
    if (days < 365) return `${Math.floor(days / 30)}ヶ月前`;
    return `${Math.floor(days / 365)}年前`;
  };

  const formatViews = (views: number) => {
    if (views < 1000) return `${views}回視聴`;
    if (views < 10000) return `${(views / 1000).toFixed(1)}K回視聴`;
    if (views < 1000000) return `${Math.floor(views / 1000)}K回視聴`;
    return `${(views / 1000000).toFixed(1)}M回視聴`;
  };

  return (
    <>
      <Card className="overflow-hidden hover:bg-muted/50 transition-colors">
        <div 
          className="aspect-video bg-muted relative cursor-pointer group"
          onClick={() => setIsPlayerOpen(true)}
        >
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-white text-lg font-semibold">再生</div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
              <img
                src={user?.channel?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"}
                alt="アバター"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold line-clamp-2 hover:underline cursor-pointer">
                {video.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 hover:text-foreground cursor-pointer truncate">
                {user?.channel?.name || "チャンネル名"}
              </p>
              <div className="text-sm text-muted-foreground truncate">
                {formatViews(video.views)} • {formatDate(video.createdAt)}
              </div>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    後で見る
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    再生リストに追加
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    共有
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    報告
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button variant="secondary" size="sm" className="gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span>{video.likes}</span>
            </Button>
            <Button variant="secondary" size="sm">
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              <span>共有</span>
            </Button>
          </div>
        </div>
      </Card>

      <VideoPlayer
        url={video.videoUrl}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
      />
    </>
  );
}