import { useState } from 'react';
import { Menu, Search, Upload, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoCard } from '@/components/VideoCard';
import { Sidebar } from '@/components/Sidebar';
import { UserMenu } from '@/components/UserMenu';
import { LoginModal } from '@/components/LoginModal';
import { ChannelSetup } from '@/components/ChannelSetup';
import { UploadModal } from '@/components/UploadModal';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/Toaster';

function MainContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { user, videos, setIsLoginModalOpen, setIsChannelSetupOpen } = useAuth();

  const handleUploadClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!user.channel) {
      setIsChannelSetupOpen(true);
      return;
    }
    setIsUploadModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 px-4">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="lg" className="h-12 w-12 p-0" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">TubeClone</h1>
          </div>
          
          <div className="flex-1 max-w-2xl mx-4">
            <div className="flex gap-2">
              <Input
                placeholder="検索"
                className="w-full h-12 text-lg"
              />
              <Button variant="secondary" size="lg" className="h-12 px-6">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="lg" className="h-12 w-12 p-0" onClick={handleUploadClick}>
              <Upload className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="lg" className="h-12 w-12 p-0">
              <Bell className="h-6 w-6" />
            </Button>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="pt-16 flex">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className={`flex-1 p-6 ${isSidebarOpen ? 'ml-60' : 'ml-[70px]'} transition-all duration-300`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </main>
      </div>

      <LoginModal />
      <ChannelSetup />
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;