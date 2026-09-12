/* Service worker tối thiểu: chỉ để Android cho phép "Cài đặt ứng dụng".
   CỐ Ý không lưu index.html — đổi địa chỉ bảng là nhân viên nhận ngay, không phải xoá app đi cài lại. */
var KHO = 'lich-dla-v1';
var ANH = ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(KHO).then(function (c) { return c.addAll(ANH); }).catch(function () {}));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.map(function (k) { return k === KHO ? null : caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // bảng thật: luôn đi thẳng ra mạng
  if (!/\.(png|webmanifest)$/.test(u.pathname)) return;                     // trang: luôn lấy bản mới
  e.respondWith(caches.match(e.request).then(function (r) { return r || fetch(e.request); }));
});
