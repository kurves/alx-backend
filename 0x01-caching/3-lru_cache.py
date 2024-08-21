#!/usr/bin/env python3
"""LRUCache module"""

from base_caching import BaseCaching

class LRUCache(BaseCaching):
    """LRUCache is a caching(Least Recently Used)"""

    def __init__(self):
        """Initialize LRUCache"""
        super().__init__()
        self.access_order = []

    def put(self, key, item):
        """Add an item in the cache using LRU algorithm"""
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.access_order.remove(key)

        self.cache_data[key] = item
        self.access_order.append(key)

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            lru_key = self.access_order.pop(0)
            del self.cache_data[lru_key]
            print(f"DISCARD: {lru_key}")

    def get(self, key):
        """Get an item by key using LRU algorithm"""
        if key is None or key not in self.cache_data:
            return None

        self.access_order.remove(key)
        self.access_order.append(key)
        return self.cache_data[key]
