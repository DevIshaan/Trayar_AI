import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ApiResponse, ApiError, RequestConfig, NetworkStatus, CacheEntry } from '@/types/api';

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.trayar.dental/v1';
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class ApiService {
  private axiosInstance: AxiosInstance;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp
        config.metadata = { startTime: Date.now() };

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Log response time in development
        if (__DEV__) {
          const duration = Date.now() - response.config.metadata?.startTime;
          console.log(`API Response (${response.config.url}): ${duration}ms`);
        }

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!this.isRefreshing) {
            this.isRefreshing = true;
            try {
              const newToken = await this.refreshToken();
              this.refreshSubscribers.forEach(callback => callback(newToken));
              this.refreshSubscribers = [];
              this.isRefreshing = false;
            } catch (refreshError) {
              this.refreshSubscribers.forEach(callback => callback(''));
              this.refreshSubscribers = [];
              this.isRefreshing = false;
              await this.handleAuthFailure();
              return Promise.reject(refreshError);
            }
          }

          return new Promise((resolve) => {
            this.refreshSubscribers.push((token) => {
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.axiosInstance(originalRequest));
              }
            });
          });
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  // Authentication methods
  private async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('auth_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async setAuthToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('auth_token', token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = await SecureStore.getItemAsync('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const { token } = response.data;
    await this.setAuthToken(token);
    return token;
  }

  private async handleAuthFailure(): Promise<void> {
    // Clear stored tokens
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('refresh_token');

    // Navigate to login (this would need to be injected from navigation)
    // In a real implementation, you'd use a navigation ref or event emitter
  }

  // HTTP Methods
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', ...config, url: endpoint });
  }

  async post<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', data, ...config, url: endpoint });
  }

  async put<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', data, ...config, url: endpoint });
  }

  async patch<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', data, ...config, url: endpoint });
  }

  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', ...config, url: endpoint });
  }

  async upload<T>(
    endpoint: string,
    file: File | { uri: string; name: string; type?: string },
    metadata?: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();

    if (file instanceof File) {
      formData.append('file', file);
    } else {
      // React Native file object
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'audio/mp4',
        name: file.name,
      } as any);
    }

    if (metadata) {
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });
    }

    return this.request<T>({
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(Math.round(progress));
        }
      },
      url: endpoint,
    });
  }

  private async request<T>(config: RequestConfig & { url: string }): Promise<ApiResponse<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        method: config.method || 'GET',
        url: config.url,
        data: config.data,
        params: config.params,
        headers: {
          ...this.axiosInstance.defaults.headers,
          ...config.headers,
        },
        timeout: config.timeout || this.axiosInstance.defaults.timeout,
      };

      // Check cache for GET requests
      if (config.method === 'GET' || !config.method) {
        const cacheKey = this.getCacheKey(config.url, config.params);
        const cachedResponse = this.getFromCache<T>(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }
      }

      let retries = 0;
      let lastError: any;

      while (retries <= MAX_RETRIES) {
        try {
          const response = await this.axiosInstance.request(axiosConfig);
          const result: ApiResponse<T> = {
            success: true,
            data: response.data,
            statusCode: response.status,
          };

          // Cache successful GET requests
          if (config.method === 'GET' || !config.method) {
            const cacheKey = this.getCacheKey(config.url, config.params);
            this.setCache(cacheKey, result);
          }

          return result;
        } catch (error) {
          lastError = error;
          retries++;

          // Don't retry on 4xx errors (except 429 - too many requests)
          if (error.response?.status >= 400 && error.response?.status !== 429) {
            break;
          }

          if (retries <= MAX_RETRIES) {
            await this.delay(RETRY_DELAY * retries);
          }
        }
      }

      throw lastError;
    } catch (error) {
      return Promise.reject(this.handleError(error));
    }
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return {
        code: data.code || 'SERVER_ERROR',
        message: data.message || 'Server error occurred',
        details: data.details,
        statusCode: status,
      };
    } else if (error.request) {
      // Network error
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection error',
        statusCode: 0,
      };
    } else {
      // Other error
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unknown error occurred',
        statusCode: 0,
      };
    }
  }

  // Cache management
  private getCacheKey(url: string, params?: Record<string, any>): string {
    const paramsString = params ? JSON.stringify(params) : '';
    return `${url}${paramsString}`;
  }

  private getFromCache<T>(key: string): ApiResponse<T> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    return entry.value;
  }

  private setCache<T>(key: string, value: ApiResponse<T>, ttl: number = 300000): void {
    // Default TTL: 5 minutes
    const entry: CacheEntry<ApiResponse<T>> = {
      key,
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0,
    };

    this.cache.set(key, entry);

    // Simple cache size management - remove oldest entries if too many
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Utility methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.get('/health');
  }
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;