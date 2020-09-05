import { getCacheKey } from './utils';
export default class RelayClientSSR {
  constructor(cache) {
    if (Array.isArray(cache)) {
      this.cache = new Map(cache);
    } else {
      this.cache = null;
    }
  }

  getMiddleware(opts) {
    return {
      execute: (operation, variables) => {
        const cache = this.cache;

        if (cache) {
          const cacheKey = getCacheKey(operation.name, variables);

          if (cache.has(cacheKey)) {
            const payload = cache.get(cacheKey);
            this.log('SSR_CACHE_GET', cacheKey, payload);
            const lookup = opts && opts.lookup;

            if (!lookup) {
              cache.delete(cacheKey);

              if (cache.size === 0) {
                this.cache = null;
              }
            }

            return payload;
          }

          this.log('SSR_CACHE_MISS', cacheKey, operation);
        }

        return undefined;
      }
    };
  }

  clear() {
    if (this.cache) {
      this.cache.clear();
    }
  }

  log(...args) {
    if (this.debug) {
      console.log('[RelayClientSSR]:', ...args);
    }
  }

}