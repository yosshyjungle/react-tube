import { createContext, useContext, useState, ReactNode } from 'react';

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

interface Channel {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  videos: Video[];
}

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  channel: Channel | null;
}

interface AuthContextType {
  user: User | null;
  videos: Video[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isChannelSetupOpen: boolean;
  setIsChannelSetupOpen: (open: boolean) => void;
  createChannel: (name: string, description: string, avatar: File | null) => Promise<void>;
  addVideo: (video: Omit<Video, 'id' | 'views' | 'likes' | 'createdAt'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChannelSetupOpen, setIsChannelSetupOpen] = useState(false);

  const login = async (email: string, password: string) => {
    if (email && password) {
      setUser({
        id: '1',
        name: 'デモユーザー',
        email: email,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        channel: null
      });
      setIsLoginModalOpen(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const createChannel = async (name: string, description: string, avatar: File | null) => {
    if (user) {
      const newChannel: Channel = {
        id: '1',
        name,
        description,
        avatarUrl: avatar ? URL.createObjectURL(avatar) : user.avatarUrl,
        videos: []
      };
      
      setUser({
        ...user,
        channel: newChannel
      });
      setIsChannelSetupOpen(false);
    }
  };

  const addVideo = (videoData: Omit<Video, 'id' | 'views' | 'likes' | 'createdAt'>) => {
    const newVideo: Video = {
      ...videoData,
      id: Math.random().toString(36).substr(2, 9),
      views: 0,
      likes: 0,
      createdAt: new Date()
    };

    setVideos(prevVideos => [newVideo, ...prevVideos]);

    if (user?.channel) {
      const updatedChannel = {
        ...user.channel,
        videos: [newVideo, ...user.channel.videos]
      };
      setUser({
        ...user,
        channel: updatedChannel
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        videos,
        login,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isChannelSetupOpen,
        setIsChannelSetupOpen,
        createChannel,
        addVideo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}