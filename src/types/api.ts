// Generic API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  statusCode?: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// HTTP Request types
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  retries?: number;
}

export interface FileUploadConfig {
  file: File | { uri: string; name: string; type?: string };
  field?: string;
  metadata?: Record<string, any>;
  onProgress?: (progress: number) => void;
}

// Network status and error types
export enum NetworkStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
  TIMEOUT = 'timeout',
}

export interface NetworkError extends Error {
  statusCode?: number;
  code?: string;
  isNetworkError?: boolean;
  isTimeout?: boolean;
  isServerError?: boolean;
  isClientError?: boolean;
}

// Environment and configuration types
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  enableLogging: boolean;
}

// Endpoint response types
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  services: {
    api: 'healthy' | 'unhealthy';
    deepgram: 'healthy' | 'unhealthy';
    gemini: 'healthy' | 'unhealthy';
    storage: 'healthy' | 'unhealthy';
  };
}

// Request/Response interceptors
export interface RequestInterceptor {
  onRequest?: (config: RequestConfig) => RequestConfig;
  onRequestError?: (error: any) => any;
  onResponse?: (response: any) => any;
  onResponseError?: (error: any) => any;
}

// Cache types
export interface CacheConfig {
  enabled: boolean;
  ttl: number; // time to live in seconds
  maxSize: number; // maximum number of cached items
  strategy: 'lru' | 'fifo' | 'custom';
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}