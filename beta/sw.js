// SQL训练营 Service Worker

const CACHE_NAME = 'sql-trainer-v1.0.0';
const STATIC_CACHE = 'sql-trainer-static-v1.0.0';
const DYNAMIC_CACHE = 'sql-trainer-dynamic-v1.0.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
    '/mobile-app.html',
    '/mobile-app.js',
    '/manifest.json',
    // 外部CDN资源
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js',
    'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/lib/codemirror.min.js',
    'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/mode/sql/sql.min.js',
    'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/lib/codemirror.min.css',
    'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/theme/monokai.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// 需要网络优先的资源
const NETWORK_FIRST_URLS = [
    '/api/',
    '/data/'
];

// 安装事件
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Failed to cache static assets', error);
            })
    );
});

// 激活事件
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // 跳过非GET请求
    if (request.method !== 'GET') {
        return;
    }
    
    // 跳过Chrome扩展请求
    if (url.protocol === 'chrome-extension:') {
        return;
    }
    
    // 处理不同的请求类型
    if (isStaticAsset(request.url)) {
        // 静态资源 - 缓存优先
        event.respondWith(cacheFirstStrategy(request));
    } else if (isNetworkFirstUrl(request.url)) {
        // 网络优先的资源
        event.respondWith(networkFirstStrategy(request));
    } else {
        // 其他资源 - 网络优先，缓存后备
        event.respondWith(networkFirstStrategy(request));
    }
});

// 判断是否为静态资源
function isStaticAsset(url) {
    return STATIC_ASSETS.some(asset => url.includes(asset)) ||
           url.includes('.css') ||
           url.includes('.js') ||
           url.includes('.woff') ||
           url.includes('.woff2');
}

// 判断是否为网络优先的URL
function isNetworkFirstUrl(url) {
    return NETWORK_FIRST_URLS.some(pattern => url.includes(pattern));
}

// 缓存优先策略
async function cacheFirstStrategy(request) {
    try {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('Service Worker: Serving from cache', request.url);
            return cachedResponse;
        }
        
        console.log('Service Worker: Not in cache, fetching', request.url);
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Service Worker: Cache first strategy failed', error);
        return new Response('Network error', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// 网络优先策略
async function networkFirstStrategy(request) {
    try {
        console.log('Service Worker: Trying network first', request.url);
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('Service Worker: Cached network response', request.url);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache', request.url);
        
        try {
            const cache = await caches.open(DYNAMIC_CACHE);
            const cachedResponse = await cache.match(request);
            
            if (cachedResponse) {
                console.log('Service Worker: Serving from cache', request.url);
                return cachedResponse;
            }
            
            // 尝试静态缓存
            const staticCache = await caches.open(STATIC_CACHE);
            const staticResponse = await staticCache.match(request);
            
            if (staticResponse) {
                return staticResponse;
            }
            
            // 返回离线页面
            return new Response(`
                <!DOCTYPE html>
                <html lang="zh-CN">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>离线模式 - SQL训练营</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
                            color: white;
                            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            min-height: 100vh;
                            text-align: center;
                        }
                        .container {
                            max-width: 400px;
                            padding: 2rem;
                        }
                        .icon {
                            font-size: 4rem;
                            margin-bottom: 1rem;
                        }
                        h1 {
                            font-size: 1.5rem;
                            margin-bottom: 1rem;
                            color: #00f5ff;
                        }
                        p {
                            color: #94a3b8;
                            line-height: 1.6;
                            margin-bottom: 2rem;
                        }
                        button {
                            background: linear-gradient(135deg, #00f5ff, #0080ff);
                            border: none;
                            border-radius: 12px;
                            color: white;
                            padding: 12px 24px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        }
                        button:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 8px 25px rgba(0, 245, 255, 0.3);
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="icon">📶</div>
                        <h1>离线模式</h1>
                        <p>您当前处于离线状态，请检查网络连接后重试。</p>
                        <button onclick="window.location.reload()">重新连接</button>
                    </div>
                </body>
                </html>
            `, {
                status: 200,
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        } catch (cacheError) {
            console.error('Service Worker: Cache fallback failed', cacheError);
            return new Response('Offline', {
                status: 503,
                headers: { 'Content-Type': 'text/plain' }
            });
        }
    }
}

// 后台同步
self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// 执行后台同步
async function doBackgroundSync() {
    try {
        console.log('Service Worker: Performing background sync');
        
        // 这里可以执行数据同步操作
        // 例如：同步用户学习进度、上传练习数据等
        
        const cache = await caches.open(DYNAMIC_CACHE);
        const requests = await cache.keys();
        
        console.log(`Service Worker: Found ${requests.length} cached requests to sync`);
        
        // 尝试重新发送缓存的请求
        for (const request of requests) {
            try {
                const response = await fetch(request);
                if (response.ok) {
                    cache.put(request, response.clone());
                    console.log('Service Worker: Synced cached request', request.url);
                }
            } catch (error) {
                console.error('Service Worker: Failed to sync request', request.url, error);
            }
        }
        
        console.log('Service Worker: Background sync completed');
    } catch (error) {
        console.error('Service Worker: Background sync failed', error);
    }
}

// 推送通知
self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: '继续您的SQL学习之旅！',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: '开始学习',
                icon: '/checkmark.png'
            },
            {
                action: 'close',
                title: '稍后提醒',
                icon: '/xmark.png'
            }
        ]
    };
    
    if (event.data) {
        const data = event.data.json();
        options.body = data.message || options.body;
        options.title = data.title || 'SQL训练营';
    }
    
    event.waitUntil(
        self.registration.showNotification('SQL训练营', options)
    );
});

// 处理通知点击
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked', event);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        // 打开应用
        event.waitUntil(
            clients.openWindow('/mobile-app.html')
        );
    } else if (event.action === 'close') {
        // 关闭通知
        console.log('Service Worker: Notification closed by user');
    } else {
        // 默认操作 - 打开应用
        event.waitUntil(
            clients.openWindow('/mobile-app.html')
        );
    }
});

// 消息处理
self.addEventListener('message', event => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(clearAllCaches());
    }
});

// 清除所有缓存
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('Service Worker: All caches cleared');
}

// 错误处理
self.addEventListener('error', event => {
    console.error('Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker: Unhandled promise rejection', event.reason);
});