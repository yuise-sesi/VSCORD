// 最小限のService Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker: インストールしたよ！');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: アクティベートしたよ！');
});

self.addEventListener('fetch', (event) => {
  // ここにキャッシュ処理を追加するとオフラインでも動くようになります
});