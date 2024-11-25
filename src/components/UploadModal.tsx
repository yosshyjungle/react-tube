import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export function UploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, addVideo } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: 'エラー',
        description: '動画ファイルを選択してください',
        variant: 'destructive',
      });
      return;
    }
    setVideo(file);
    const videoUrl = URL.createObjectURL(file);
    setVideoPreview(videoUrl);

    // サムネイルが設定されていない場合は、動画の最初のフレームをサムネイルとして使用
    if (!thumbnail) {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.addEventListener('loadeddata', () => {
        video.currentTime = 0;
      });
      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL('image/jpeg');
        setThumbnailPreview(thumbnailUrl);
      });
    }
  };

  const handleThumbnailSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'エラー',
        description: '画像ファイルを選択してください',
        variant: 'destructive',
      });
      return;
    }
    setThumbnail(file);
    const thumbnailUrl = URL.createObjectURL(file);
    setThumbnailPreview(thumbnailUrl);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('video/')) {
      handleVideoSelect(file);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setThumbnail(null);
    setThumbnailPreview(null);
    setVideo(null);
    setVideoPreview(null);
    setUploadProgress(0);
    setVisibility('public');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || !user?.channel) {
      toast({
        title: 'エラー',
        description: 'チャンネルを作成してから動画をアップロードしてください',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      // アップロードの進捗をシミュレート
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }
      
      // 動画を追加
      const videoData = {
        title,
        description,
        thumbnailUrl: thumbnailPreview || '',
        videoUrl: videoPreview!,
        channelId: user.channel.id
      };

      addVideo(videoData);

      toast({
        title: 'アップロード完了',
        description: '動画が正常にアップロードされました',
      });
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'エラー',
        description: 'アップロードに失敗しました',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
      }
      onClose();
    }}>
      <DialogContent className="sm:max-w-[800px] h-[80vh]">
        <DialogHeader>
          <DialogTitle>動画のアップロード</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex h-full">
          <div className="w-[200px] border-r pr-4">
            <TabsList className="flex flex-col h-auto bg-transparent p-0">
              <TabsTrigger
                value="details"
                className="justify-start w-full mb-2"
              >
                詳細
              </TabsTrigger>
              <TabsTrigger
                value="visibility"
                className="justify-start w-full"
              >
                公開設定
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 pl-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <TabsContent value="details" className="m-0">
                {!video ? (
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleVideoSelect(file);
                      }}
                    />
                    <div className="space-y-4">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="text-muted-foreground">
                        アップロードする動画をドラッグ＆ドロップ
                      </div>
                      <Button type="button">
                        ファイルを選択
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                      <video
                        src={videoPreview!}
                        className="w-full h-full object-contain"
                        controls
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setVideo(null);
                          setVideoPreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">タイトル</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">説明</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>サムネイル</Label>
                      <div className="grid grid-cols-3 gap-4">
                        {/* 自動生成されたサムネイル */}
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                          <video
                            src={videoPreview!}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* カスタムサムネイルのアップロード */}
                        <div
                          className={`aspect-video bg-muted rounded-lg overflow-hidden relative cursor-pointer hover:bg-muted/80 ${
                            !thumbnailPreview && "flex items-center justify-center"
                          }`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleThumbnailSelect(file);
                            }}
                          />
                          {thumbnailPreview ? (
                            <>
                              <img
                                src={thumbnailPreview}
                                alt="カスタムサムネイル"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setThumbnail(null);
                                  setThumbnailPreview(null);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <div className="text-center p-4">
                              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <div className="text-sm text-muted-foreground">
                                カスタムサムネイル
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="visibility" className="m-0 space-y-4">
                <div className="space-y-4">
                  <Label>公開設定</Label>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant={visibility === 'public' ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setVisibility('public')}
                    >
                      公開
                    </Button>
                    <Button
                      type="button"
                      variant={visibility === 'unlisted' ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setVisibility('unlisted')}
                    >
                      限定公開
                    </Button>
                    <Button
                      type="button"
                      variant={visibility === 'private' ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setVisibility('private')}
                    >
                      非公開
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>アップロード中... {uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  disabled={!video || isUploading || !title || !user?.channel}
                >
                  {isUploading ? 'アップロード中...' : 'アップロード'}
                </Button>
              </div>
            </form>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}