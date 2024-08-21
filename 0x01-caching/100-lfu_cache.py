#!/usr/bin/env python3
"""LFUCache module"""

from base_caching import BaseCaching

class LFUCache(BaseCaching):
    """LFUCache caching system that uses LFU (Least Frequently Used)"""

    def __init__(self):
        """Initialize LFUCache"""
        super().__init__()
        self.frequency = {}
        self.access_order = {}

    def put(self, key, item):
        """Add an item in the cache using LFU algorithm"""
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.cache_data[key] = item
            self.frequency[key] += 1
        else:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                min_freq = min(self.frequency.values())
                lfu_keys = [k for k, v in self.frequency.items() if v == min_freq]
                
                if len(lfu_keys) > 1:
                    lru_key = min(lfu_keys, key=lambda k: self.access_order[k])
                    del self.cache_data[lru_key]
                    del self.frequency[lru_key]
                    del self.access_order[lru_key]
                    print(f"DISCARD: {lru_key}")
                else:
                    lfu_key = lfu_keys[0]
                    del self.cache_data[lfu_key]
                    del self.frequency[lfu_key]
                    del self.access_order[lfu_key]
                    print(f"DISCARD: {lfu_key}")
            
            self.cache_data[key] = item
            self.frequency[key] = 1

        self.access_order[key] = len(self.access_order)

    def get(self, key):
        """Get an item by key using LFU algorithm"""
        if key is None or key not in self.cache_data:
            return None

        self.frequency[key] += 1
        self.access_order[key] = len(self.access_order)
        return self.cache_data[key]
