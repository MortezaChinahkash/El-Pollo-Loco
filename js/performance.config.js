// Performance Configuration for El Pollo Loco
const PERFORMANCE_CONFIG = {
  // Canvas optimization
  CANVAS_BUFFER_SIZE: 2, // Double buffering
  TARGET_FPS: 60,
  
  // Audio optimization
  AUDIO_PRELOAD_COUNT: 5, // Preload first 5 sounds
  AUDIO_POOL_SIZE: 10, // Audio object pool size
  
  // Game object optimization
  MAX_PARTICLES: 50,
  MAX_ENEMIES: 20,
  MAX_COLLECTIBLES: 30,
  
  // Memory management
  GARBAGE_COLLECTION_INTERVAL: 30000, // 30 seconds
  CLEANUP_INTERVAL: 5000, // 5 seconds
  
  // Image optimization
  IMAGE_CACHE_SIZE: 100,
  SPRITE_BATCH_SIZE: 20,
  
  // Network optimization
  RESOURCE_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PERFORMANCE_CONFIG;
}
