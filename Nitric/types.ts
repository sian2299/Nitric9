
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  groundingLinks?: { title: string; uri: string }[];
  audioData?: string; // Base64 PCM or URI
  imageUrl?: string; // Base64 or URL for generated images
  status?: 'sending' | 'sent' | 'error';
  errorType?: 'rate_limit' | 'safety' | 'auth' | 'network' | 'unknown';
}

export interface UserSettings {
  aiName: string;
  userName: string;
  voiceEnabled: boolean;
  autoPlayVoice: boolean;
  persistenceEnabled: boolean;
  cloudSyncEnabled: boolean;
  lastSync?: string;
}

export interface LearningTrack {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
}

export interface SearchResult {
  title: string;
  uri: string;
}
