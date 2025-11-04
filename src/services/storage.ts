import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Session, Feedback } from '@/types';

export class StorageService {
  private readonly SECURE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_PREFERENCES: 'user_preferences',
  };

  private readonly STORAGE_KEYS = {
    USER: 'user_data',
    SESSIONS: 'sessions',
    OFFLINE_QUEUE: 'offline_queue',
    APP_SETTINGS: 'app_settings',
    CACHE_PREFIX: 'cache_',
  };

  // Secure Storage Methods (for sensitive data)
  async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error storing secure item ${key}:`, error);
      throw error;
    }
  }

  async getSecureItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error retrieving secure item ${key}:`, error);
      return null;
    }
  }

  async removeSecureItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing secure item ${key}:`, error);
      throw error;
    }
  }

  async clearSecureStorage(): Promise<void> {
    try {
      const keys = Object.values(this.SECURE_KEYS);
      for (const key of keys) {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw error;
    }
  }

  // Authentication Token Management
  async setAuthToken(token: string): Promise<void> {
    await this.setSecureItem(this.SECURE_KEYS.AUTH_TOKEN, token);
  }

  async getAuthToken(): Promise<string | null> {
    return this.getSecureItem(this.SECURE_KEYS.AUTH_TOKEN);
  }

  async setRefreshToken(token: string): Promise<void> {
    await this.setSecureItem(this.SECURE_KEYS.REFRESH_TOKEN, token);
  }

  async getRefreshToken(): Promise<string | null> {
    return this.getSecureItem(this.SECURE_KEYS.REFRESH_TOKEN);
  }

  async clearAuthTokens(): Promise<void> {
    await this.removeSecureItem(this.SECURE_KEYS.AUTH_TOKEN);
    await this.removeSecureItem(this.SECURE_KEYS.REFRESH_TOKEN);
  }

  // User Data Storage
  async setUser(user: User): Promise<void> {
    try {
      const userJson = JSON.stringify(user);
      await AsyncStorage.setItem(this.STORAGE_KEYS.USER, userJson);
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(this.STORAGE_KEYS.USER);
      if (!userJson) return null;

      const user = JSON.parse(userJson);
      return user;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  // Session Storage
  async saveSession(session: Session): Promise<void> {
    try {
      const existingSessions = await this.getSessions();
      const updatedSessions = [session, ...existingSessions.filter(s => s.id !== session.id)];

      // Keep only the last 100 sessions locally
      const limitedSessions = updatedSessions.slice(0, 100);

      const sessionsJson = JSON.stringify(limitedSessions);
      await AsyncStorage.setItem(this.STORAGE_KEYS.SESSIONS, sessionsJson);
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }

  async getSessions(): Promise<Session[]> {
    try {
      const sessionsJson = await AsyncStorage.getItem(this.STORAGE_KEYS.SESSIONS);
      if (!sessionsJson) return [];

      const sessions = JSON.parse(sessionsJson);
      return sessions;
    } catch (error) {
      console.error('Error retrieving sessions:', error);
      return [];
    }
  }

  async getSession(sessionId: string): Promise<Session | null> {
    try {
      const sessions = await this.getSessions();
      return sessions.find(s => s.id === sessionId) || null;
    } catch (error) {
      console.error('Error retrieving session:', error);
      return null;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const sessions = await this.getSessions();
      const filteredSessions = sessions.filter(s => s.id !== sessionId);
      const sessionsJson = JSON.stringify(filteredSessions);
      await AsyncStorage.setItem(this.STORAGE_KEYS.SESSIONS, sessionsJson);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  async clearSessions(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEYS.SESSIONS);
    } catch (error) {
      console.error('Error clearing sessions:', error);
    }
  }

  // Feedback Storage
  async saveFeedback(feedback: Feedback): Promise<void> {
    try {
      const session = await this.getSession(feedback.sessionId);
      if (session) {
        session.feedback = feedback;
        await this.saveSession(session);
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      throw error;
    }
  }

  // Offline Queue for failed network requests
  async addToOfflineQueue(action: any): Promise<void> {
    try {
      const queue = await this.getOfflineQueue();
      queue.push({
        ...action,
        timestamp: Date.now(),
        id: `${Date.now()}-${Math.random()}`,
      });

      // Keep queue size manageable
      const limitedQueue = queue.slice(-50);
      const queueJson = JSON.stringify(limitedQueue);
      await AsyncStorage.setItem(this.STORAGE_KEYS.OFFLINE_QUEUE, queueJson);
    } catch (error) {
      console.error('Error adding to offline queue:', error);
      throw error;
    }
  }

  async getOfflineQueue(): Promise<any[]> {
    try {
      const queueJson = await AsyncStorage.getItem(this.STORAGE_KEYS.OFFLINE_QUEUE);
      if (!queueJson) return [];

      const queue = JSON.parse(queueJson);
      return queue;
    } catch (error) {
      console.error('Error retrieving offline queue:', error);
      return [];
    }
  }

  async clearOfflineQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEYS.OFFLINE_QUEUE);
    } catch (error) {
      console.error('Error clearing offline queue:', error);
    }
  }

  async removeFromOfflineQueue(actionId: string): Promise<void> {
    try {
      const queue = await this.getOfflineQueue();
      const filteredQueue = queue.filter(item => item.id !== actionId);
      const queueJson = JSON.stringify(filteredQueue);
      await AsyncStorage.setItem(this.STORAGE_KEYS.OFFLINE_QUEUE, queueJson);
    } catch (error) {
      console.error('Error removing from offline queue:', error);
      throw error;
    }
  }

  // App Settings
  async setAppSetting(key: string, value: any): Promise<void> {
    try {
      const settings = await this.getAppSettings();
      settings[key] = value;
      const settingsJson = JSON.stringify(settings);
      await AsyncStorage.setItem(this.STORAGE_KEYS.APP_SETTINGS, settingsJson);
    } catch (error) {
      console.error('Error setting app setting:', error);
      throw error;
    }
  }

  async getAppSetting(key: string): Promise<any> {
    try {
      const settings = await this.getAppSettings();
      return settings[key];
    } catch (error) {
      console.error('Error getting app setting:', error);
      return null;
    }
  }

  async getAppSettings(): Promise<Record<string, any>> {
    try {
      const settingsJson = await AsyncStorage.getItem(this.STORAGE_KEYS.APP_SETTINGS);
      if (!settingsJson) return {};

      const settings = JSON.parse(settingsJson);
      return settings;
    } catch (error) {
      console.error('Error retrieving app settings:', error);
      return {};
    }
  }

  // Generic Cache Methods
  async setCacheItem(key: string, data: any, ttl: number = 300000): Promise<void> {
    try {
      const cacheKey = this.STORAGE_KEYS.CACHE_PREFIX + key;
      const cacheItem = {
        data,
        timestamp: Date.now(),
        ttl,
      };

      const cacheJson = JSON.stringify(cacheItem);
      await AsyncStorage.setItem(cacheKey, cacheJson);
    } catch (error) {
      console.error('Error setting cache item:', error);
      throw error;
    }
  }

  async getCacheItem(key: string): Promise<any | null> {
    try {
      const cacheKey = this.STORAGE_KEYS.CACHE_PREFIX + key;
      const cacheJson = await AsyncStorage.getItem(cacheKey);
      if (!cacheJson) return null;

      const cacheItem = JSON.parse(cacheJson);
      const now = Date.now();

      // Check if cache item has expired
      if (now - cacheItem.timestamp > cacheItem.ttl) {
        await AsyncStorage.removeItem(cacheKey);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Error getting cache item:', error);
      return null;
    }
  }

  async removeCacheItem(key: string): Promise<void> {
    try {
      const cacheKey = this.STORAGE_KEYS.CACHE_PREFIX + key;
      await AsyncStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Error removing cache item:', error);
    }
  }

  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.STORAGE_KEYS.CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }

  // Cleanup Methods
  async clearAllData(): Promise<void> {
    try {
      await this.clearSecureStorage();
      await this.clearUser();
      await this.clearSessions();
      await this.clearOfflineQueue();
      await this.clearCache();
      await AsyncStorage.removeItem(this.STORAGE_KEYS.APP_SETTINGS);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Storage Info
  async getStorageInfo(): Promise<{
    secureStorageSize: number;
    asyncStorageSize: number;
    totalItems: number;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      }

      return {
        secureStorageSize: 0, // Can't easily measure SecureStore size
        asyncStorageSize: totalSize,
        totalItems: keys.length,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        secureStorageSize: 0,
        asyncStorageSize: 0,
        totalItems: 0,
      };
    }
  }

  // Maintenance
  async cleanupExpiredCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.STORAGE_KEYS.CACHE_PREFIX));
      const now = Date.now();

      for (const key of cacheKeys) {
        const cacheJson = await AsyncStorage.getItem(key);
        if (cacheJson) {
          const cacheItem = JSON.parse(cacheJson);
          if (now - cacheItem.timestamp > cacheItem.ttl) {
            await AsyncStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up expired cache:', error);
    }
  }

  // Export/Import for data migration
  async exportUserData(): Promise<string> {
    try {
      const userData = {
        user: await this.getUser(),
        sessions: await this.getSessions(),
        settings: await this.getAppSettings(),
      };

      return JSON.stringify(userData);
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }

  async importUserData(data: string): Promise<void> {
    try {
      const userData = JSON.parse(data);

      if (userData.user) {
        await this.setUser(userData.user);
      }

      if (userData.sessions) {
        const sessionsJson = JSON.stringify(userData.sessions);
        await AsyncStorage.setItem(this.STORAGE_KEYS.SESSIONS, sessionsJson);
      }

      if (userData.settings) {
        const settingsJson = JSON.stringify(userData.settings);
        await AsyncStorage.setItem(this.STORAGE_KEYS.APP_SETTINGS, settingsJson);
      }
    } catch (error) {
      console.error('Error importing user data:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const storageService = new StorageService();
export default storageService;