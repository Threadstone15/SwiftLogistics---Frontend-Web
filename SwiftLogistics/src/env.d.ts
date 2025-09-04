/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_ENV: string
  readonly VITE_DEBUG: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_WEBSOCKET_TIMEOUT: string
  readonly VITE_RATE_LIMIT_REQUESTS_PER_MINUTE: string
  readonly VITE_CACHE_TTL_DEFAULT: string
  readonly VITE_CACHE_TTL_STATIC: string
  readonly VITE_MAX_RETRIES: string
  readonly VITE_RETRY_DELAY: string
  readonly VITE_ENABLE_WEBSOCKET: string
  readonly VITE_ENABLE_GEOLOCATION: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_MAP_API_KEY: string
  readonly VITE_DEFAULT_MAP_CENTER_LAT: string
  readonly VITE_DEFAULT_MAP_CENTER_LNG: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_ENABLE_ERROR_REPORTING: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
