#!/usr/bin/env python3
"""MRUCache module"""

from base_caching import BaseCaching

class MRUCache(BaseCaching):
    """MRUCache caching system that uses MRU (Most Recently Used)"""

    def __init__(self):
        """Initialize MRUCache"""
        super().__init__()
        self.access_order = []

    def put(self, key, item):
        """Add an item in the cache using MRU algorithm"""
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.access_order.remove(key)

        self.cache_data[key] = item
        self.access_order.append(key)

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            mru_key = self.access_order.pop()
            del self.cache_data[mru_key]
            print(f"DISCARD: {mru_key}")

    def get(self, key):
        """Get an item by key using MRU algorithm"""
        if key is None or key not in self.cache_data:
            return None

        self.access_order.remove(key)
        self.access_order.append(key)
        return self.cache_data[key]
