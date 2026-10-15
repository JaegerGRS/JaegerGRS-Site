"""YouTube and trend research used to ground content ideas in current demand."""
from __future__ import annotations

from typing import Dict, List

import requests

from src.config import GOOGLE_TRENDS_PROVIDER, SERPAPI_KEY, YOUTUBE_API_KEY


class TrendResearch:
    """Fetch public trend signals without exposing provider credentials to clients."""

    YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
    SERPAPI_TRENDS_URL = "https://serpapi.com/search.json"

    def get_research(self, query: str, region: str = "GB", youtube_api_key: str = "") -> Dict:
        normalized_query = query.strip()
        if not normalized_query:
            raise ValueError("A topic is required for research.")

        return {
            "query": normalized_query,
            "region": region.upper(),
            "youtube": self._search_youtube(normalized_query, region, youtube_api_key),
            "trends": self._get_trends(normalized_query, region),
        }

    def _search_youtube(self, query: str, region: str, youtube_api_key: str = "") -> Dict:
        api_key = youtube_api_key or YOUTUBE_API_KEY
        if not api_key:
            return self._unavailable("YouTube Data API key is not configured.")

        try:
            response = requests.get(
                self.YOUTUBE_SEARCH_URL,
                params={
                    "key": api_key,
                    "part": "snippet",
                    "q": query,
                    "type": "video",
                    "order": "relevance",
                    "regionCode": region.upper(),
                    "maxResults": 10,
                    "safeSearch": "strict",
                },
                timeout=15,
            )
            response.raise_for_status()
            items = response.json().get("items", [])
            return {
                "available": True,
                "items": [
                    {
                        "video_id": item["id"].get("videoId"),
                        "title": item["snippet"].get("title"),
                        "channel": item["snippet"].get("channelTitle"),
                        "published_at": item["snippet"].get("publishedAt"),
                        "thumbnail": item["snippet"].get("thumbnails", {}).get("medium", {}).get("url"),
                    }
                    for item in items
                    if item.get("id", {}).get("videoId")
                ],
            }
        except requests.RequestException as error:
            return self._unavailable(f"YouTube research failed: {error}")

    def _get_trends(self, query: str, region: str) -> Dict:
        if GOOGLE_TRENDS_PROVIDER != "serpapi":
            return self._unavailable(
                "No Trends provider is configured. Set GOOGLE_TRENDS_PROVIDER=serpapi and SERPAPI_KEY."
            )
        if not SERPAPI_KEY:
            return self._unavailable("SerpApi key is not configured for Google Trends data.")

        try:
            response = requests.get(
                self.SERPAPI_TRENDS_URL,
                params={
                    "engine": "google_trends",
                    "q": query,
                    "geo": region.upper(),
                    "api_key": SERPAPI_KEY,
                },
                timeout=20,
            )
            response.raise_for_status()
            payload = response.json()
            related_queries = payload.get("related_queries", {})
            return {
                "available": True,
                "interest_over_time": payload.get("interest_over_time", {}),
                "related_queries": related_queries,
                "related_topics": payload.get("related_topics", {}),
            }
        except requests.RequestException as error:
            return self._unavailable(f"Google Trends research failed: {error}")

    @staticmethod
    def _unavailable(message: str) -> Dict:
        return {"available": False, "message": message, "items": []}
