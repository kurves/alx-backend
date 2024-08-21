#!/usr/bin/;env python3
"""LIFOCache module"""

from base_caching import BaseCaching

class LIFOCache(BaseCaching):
    """LIFOCache is a caching system that uses LIFO (Last-In, First-Out)"""

    def __init__(self):
        """Initialize LIFOCache"""
        super().__init__()

    def put(self, key, item):
        """Add an item in the cache using LIFO algorithm"""
        if key is None or item is None:
            return

        self.cache_data[key] = item

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            last_key = list(self.cache_data.keys())[-2]
            del self.cache_data[last_key]
            print(f"DISCARD: {last_key}")

    def get(self, key):
        """Get an item by key"""
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data[key]
