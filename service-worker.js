const CACHE_NAME = "music-cache-v1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "/",        // index.html
        "/manifest.json",
        "/icon.png",
        // 必要ならCSSやJSも追加
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(res => {
        // 音声ファイルならキャッシュに追加
        if (event.request.url.endsWith(".mp4") || event.request.url.endsWith(".m4a")) {
          let resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, resClone);
          });
        }
        return res;
      });
    })
  );
});
