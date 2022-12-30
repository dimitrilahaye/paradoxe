(()=>{"use strict";var e={913:()=>{try{self["workbox:core:6.5.0"]&&_()}catch(e){}},977:()=>{try{self["workbox:precaching:6.5.0"]&&_()}catch(e){}},80:()=>{try{self["workbox:routing:6.5.0"]&&_()}catch(e){}},873:()=>{try{self["workbox:strategies:6.5.0"]&&_()}catch(e){}}},t={};function s(a){var n=t[a];if(void 0!==n)return n.exports;var r=t[a]={exports:{}};return e[a](r,r.exports,s),r.exports}(()=>{s(913);class e extends Error{constructor(e,t){super(((e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s})(e,t)),this.name=e,this.details=t}}const t={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},a=e=>[t.prefix,e,t.suffix].filter((e=>e&&e.length>0)).join("-"),n=e=>e||a(t.precache);function r(e,t){const s=t();return e.waitUntil(s),s}function i(t){if(!t)throw new e("add-to-cache-list-unexpected-type",{entry:t});if("string"==typeof t){const e=new URL(t,location.href);return{cacheKey:e.href,url:e.href}}const{revision:s,url:a}=t;if(!a)throw new e("add-to-cache-list-unexpected-type",{entry:t});if(!s){const e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}const n=new URL(a,location.href),r=new URL(a,location.href);return n.searchParams.set("__WB_REVISION__",s),{cacheKey:n.href,url:r.href}}s(977);class c{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class o{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}let h;function l(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class u{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const d=new Set;function f(e){return"string"==typeof e?new Request(e):e}s(873);class p{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new u,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const e of this._plugins)this._pluginStateMap.set(e,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(t){const{event:s}=this;let a=f(t);if("navigate"===a.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const n=this.hasCallback("fetchDidFail")?a.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:s})}catch(t){if(t instanceof Error)throw new e("plugin-error-request-will-fetch",{thrownErrorMessage:t.message})}const r=a.clone();try{let e;e=await fetch(a,"navigate"===a.mode?void 0:this._strategy.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:r,response:e});return e}catch(e){throw n&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:n.clone(),request:r.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=f(e);let s;const{cacheName:a,matchOptions:n}=this._strategy,r=await this.getCacheKey(t,"read"),i=Object.assign(Object.assign({},n),{cacheName:a});s=await caches.match(r,i);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:a,matchOptions:n,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(t,s){const a=f(t);await(0,new Promise((e=>setTimeout(e,0))));const n=await this.getCacheKey(a,"write");if(!s)throw new e("cache-put-with-no-response",{url:(r=n.url,new URL(String(r),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var r;const i=await this._ensureResponseSafeToCache(s);if(!i)return!1;const{cacheName:c,matchOptions:o}=this._strategy,h=await self.caches.open(c),u=this.hasCallback("cacheDidUpdate"),p=u?await async function(e,t,s,a){const n=l(t.url,s);if(t.url===n)return e.match(t,a);const r=Object.assign(Object.assign({},a),{ignoreSearch:!0}),i=await e.keys(t,r);for(const t of i)if(n===l(t.url,s))return e.match(t,a)}(h,n.clone(),["__WB_REVISION__"],o):null;try{await h.put(n,u?i.clone():i)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of d)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:c,oldResponse:p,newResponse:i.clone(),request:n,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let a=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))a=f(await e({mode:t,request:a,event:this.event,params:this.params}));this._cacheKeys[s]=a}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const s=this._pluginStateMap.get(t),a=a=>{const n=Object.assign(Object.assign({},a),{state:s});return t[e](n)};yield a}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class g extends class{constructor(e={}){this.cacheName=e.cacheName||a(t.runtime),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,a="params"in e?e.params:void 0,n=new p(this,{event:t,request:s,params:a}),r=this._getResponse(n,s,t);return[r,this._awaitComplete(r,n,s,t)]}async _getResponse(t,s,a){let n;await t.runCallbacks("handlerWillStart",{event:a,request:s});try{if(n=await this._handle(s,t),!n||"error"===n.type)throw new e("no-response",{url:s.url})}catch(e){if(e instanceof Error)for(const r of t.iterateCallbacks("handlerDidError"))if(n=await r({error:e,event:a,request:s}),n)break;if(!n)throw e}for(const e of t.iterateCallbacks("handlerWillRespond"))n=await e({event:a,request:s,response:n});return n}async _awaitComplete(e,t,s,a){let n,r;try{n=await e}catch(r){}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:n}),await t.doneWaiting()}catch(e){e instanceof Error&&(r=e)}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:n,error:r}),t.destroy(),r)throw r}}{constructor(e={}){e.cacheName=n(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(g.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){return await t.cacheMatch(e)||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(t,s){let a;const n=s.params||{};if(!this._fallbackToNetwork)throw new e("missing-precache-entry",{cacheName:this.cacheName,url:t.url});{const e=n.integrity,r=t.integrity,i=!r||r===e;a=await s.fetch(new Request(t,{integrity:r||e})),e&&i&&(this._useDefaultCacheabilityPluginIfNeeded(),await s.cachePut(t,a.clone()))}return a}async _handleInstall(t,s){this._useDefaultCacheabilityPluginIfNeeded();const a=await s.fetch(t);if(!await s.cachePut(t,a.clone()))throw new e("bad-precaching-response",{url:t.url,status:a.status});return a}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,a]of this.plugins.entries())a!==g.copyRedirectedCacheableResponsesPlugin&&(a===g.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);0===t?this.plugins.push(g.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}g.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},g.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:t})=>t.redirected?await async function(t,s){let a=null;if(t.url&&(a=new URL(t.url).origin),a!==self.location.origin)throw new e("cross-origin-copy-response",{origin:a});const n=t.clone(),r={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},i=s?s(r):r,c=function(){if(void 0===h){const e=new Response("");if("body"in e)try{new Response(e.body),h=!0}catch(e){h=!1}h=!1}return h}()?n.body:await n.blob();return new Response(c,i)}(t):t};class y{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new g({cacheName:n(e),plugins:[...t,new o({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(t){const s=[];for(const a of t){"string"==typeof a?s.push(a):a&&void 0===a.revision&&s.push(a.url);const{cacheKey:t,url:n}=i(a),r="string"!=typeof a&&a.revision?"reload":"default";if(this._urlsToCacheKeys.has(n)&&this._urlsToCacheKeys.get(n)!==t)throw new e("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(n),secondEntry:t});if("string"!=typeof a&&a.integrity){if(this._cacheKeysToIntegrities.has(t)&&this._cacheKeysToIntegrities.get(t)!==a.integrity)throw new e("add-to-cache-list-conflicting-integrities",{url:n});this._cacheKeysToIntegrities.set(t,a.integrity)}if(this._urlsToCacheKeys.set(n,t),this._urlsToCacheModes.set(n,r),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return r(e,(async()=>{const t=new c;this.strategy.plugins.push(t);for(const[t,s]of this._urlsToCacheKeys){const a=this._cacheKeysToIntegrities.get(s),n=this._urlsToCacheModes.get(t),r=new Request(t,{integrity:a,cache:n,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:r,event:e}))}const{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}}))}activate(e){return r(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),a=[];for(const n of t)s.has(n.url)||(await e.delete(n),a.push(n.url));return{deletedURLs:a}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s)return(await self.caches.open(this.strategy.cacheName)).match(s)}createHandlerBoundToURL(t){const s=this.getCacheKeyForURL(t);if(!s)throw new e("non-precached-url",{url:t});return e=>(e.request=new Request(t),e.params=Object.assign({cacheKey:s},e.params),this.strategy.handle(e))}}let w;const m=()=>(w||(w=new y),w);s(80);const _=e=>e&&"object"==typeof e?e:{handle:e};class R{constructor(e,t,s="GET"){this.handler=_(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=_(e)}}class v extends R{constructor(e,t,s){super((({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)}),t,s)}}class C{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const a=s.origin===location.origin,{params:n,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:a,url:s});let i=r&&r.handler;const c=e.method;if(!i&&this._defaultHandlerMap.has(c)&&(i=this._defaultHandlerMap.get(c)),!i)return;let o;try{o=i.handle({url:s,request:e,event:t,params:n})}catch(e){o=Promise.reject(e)}const h=r&&r.catchHandler;return o instanceof Promise&&(this._catchHandler||h)&&(o=o.catch((async a=>{if(h)try{return await h.handle({url:s,request:e,event:t,params:n})}catch(e){e instanceof Error&&(a=e)}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw a}))),o}findMatchingRoute({url:e,sameOrigin:t,request:s,event:a}){const n=this._routes.get(s.method)||[];for(const r of n){let n;const i=r.match({url:e,sameOrigin:t,request:s,event:a});if(i)return n=i,(Array.isArray(n)&&0===n.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"==typeof i)&&(n=void 0),{route:r,params:n}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,_(e))}setCatchHandler(e){this._catchHandler=_(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(t){if(!this._routes.has(t.method))throw new e("unregister-route-but-not-found-with-method",{method:t.method});const s=this._routes.get(t.method).indexOf(t);if(!(s>-1))throw new e("unregister-route-route-not-registered");this._routes.get(t.method).splice(s,1)}}let b;class q extends R{constructor(e,t){super((({request:s})=>{const a=e.getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:a=!0,urlManipulation:n}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const i=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}(r,t);if(yield i.href,s&&i.pathname.endsWith("/")){const e=new URL(i.href);e.pathname+=s,yield e.href}if(a){const e=new URL(i.href);e.pathname+=".html",yield e.href}if(n){const e=n({url:r});for(const t of e)yield t.href}}(s.url,t)){const t=a.get(n);if(t)return{cacheKey:t,integrity:e.getIntegrityForCacheKey(t)}}}),e.strategy)}}var U;U=[{'revision':'3d629fd33b3165a1171b46f50e6e6936','url':'assets/fonts/SquaredanceFontV1-Regular.ttf'},{'revision':'8060bd455447009dfbbf196064a92fc6','url':'assets/fonts/pixels.png'},{'revision':'51af9dbd08660e2b8b086e17f82ca263','url':'assets/fonts/pixels.xml.fnt'},{'revision':'b7d0f318945ef0590252d01a26ab8207','url':'assets/fonts/pixels2.json'},{'revision':'dd1db882e64c967e3e24cbb3eb7fe8cf','url':'assets/fonts/pixels2.png'},{'revision':'7d31e5dee705061f6429505a3ba87231','url':'assets/img/chars/player_atlas.png'},{'revision':'700032d34e208a3fb3b68a2f6bfd7db1','url':'assets/img/logo-1200-3.png'},{'revision':'3ae091d004d9f8db13434ccdd7162ce3','url':'assets/img/objects/bool_white_off.png'},{'revision':'1ef9d5c558936d2dfa79cac2a12a9660','url':'assets/img/objects/bool_white_on.png'},{'revision':'d416c014d712d63e1482904b9e5b7cb1','url':'assets/img/objects/door_end_close.png'},{'revision':'1bd3558f6dc4296b4833bee3be93de39','url':'assets/img/objects/door_end_open.png'},{'revision':'1bd3558f6dc4296b4833bee3be93de39','url':'assets/img/objects/door_start.png'},{'revision':'a866a576e3d70873f8d4320c937e5105','url':'assets/img/objects/door_tp.png'},{'revision':'a866a576e3d70873f8d4320c937e5105','url':'assets/img/objects/door_tp_green.png'},{'revision':'485b0f9e504d3bd74cdcdb47093631fe','url':'assets/img/objects/door_tp_red.png'},{'revision':'af3fcdaf43eab2a1e458117af9bcc5e5','url':'assets/img/objects/simple_bullet_atlas.png'},{'revision':'56d6148d8491a49873d46e6779e7b490','url':'assets/img/objects/switcher_green.png'},{'revision':'254cdcd75810c77193272252398cdf51','url':'assets/img/objects/switcher_orange.png'},{'revision':'b0ec7f66a40c6060975ad31faa64e0ac','url':'assets/img/objects/switcher_red.png'},{'revision':'92ec49d6e959f6cd98c0571b2fb72406','url':'assets/img/objects/tp_green.png'},{'revision':'6bb390ea7d296873b96c2e8c9c929b02','url':'assets/img/objects/tp_green_close.png'},{'revision':'532598c73674d40ec66860a6e1b07b6f','url':'assets/img/objects/tp_orange.png'},{'revision':'e0166f8976a8ffd4fb8284edaf6bcc22','url':'assets/img/objects/tp_orange_close.png'},{'revision':'b2d462cd4a6a18fec1174c656f41b86c','url':'assets/img/objects/tp_red.png'},{'revision':'7df04d2ce59971da9fcbff9386b1569f','url':'assets/img/objects/tp_red_close.png'},{'revision':'ff5e97276ffd9ffd6c48eb6de08325aa','url':'assets/img/particles/simple_gun_shot.png'},{'revision':'5d2920f1676d1cab4650e38902520e45','url':'assets/img/tileset.png'},{'revision':'9d3cb1e2dfbf0d91ff05ae00365815ec','url':'assets/img/ui/arrow-down-left.png'},{'revision':'1737d16ca1b0f1b704990255175035d1','url':'assets/img/ui/audioOff.png'},{'revision':'8d8dfba47a06bc6ed6d23842a1bde242','url':'assets/img/ui/audioOn.png'},{'revision':'966853bddae5887dfec1921eb7c56070','url':'assets/img/ui/cancel.png'},{'revision':'17ad2a0ebef3d3e4c094686f5dd5a8c5','url':'assets/img/ui/checkmark.png'},{'revision':'0f5fd1e36374acd9da6687b4929fa265','url':'assets/img/ui/cross.png'},{'revision':'b8d06b20ff5d0e167138aa837f61acbd','url':'assets/img/ui/exit.png'},{'revision':'bedff21c9a444a72128c9a307aace52a','url':'assets/img/ui/musicOff.png'},{'revision':'890879f10562e61a8013cdf1f511f61f','url':'assets/img/ui/musicOn.png'},{'revision':'eecb508275c177c32a49c122148cd4a2','url':'assets/img/ui/return.png'},{'revision':'cbbf6c9b65a26e264bfda19c71cd1d32','url':'assets/json/chars/player_atlas.json'},{'revision':'2bb35b5c2c2e4fa0f0065430f02371e2','url':'assets/json/levels/game-screen.json'},{'revision':'899c69f377d3cb2f59db845c2ce4aa51','url':'assets/json/levels/game-screen.tmx'},{'revision':'acd19b4726228c345ade4ed69d934efe','url':'assets/json/levels/level1.json'},{'revision':'8f76da84787c878faecb274a0a99b758','url':'assets/json/levels/level1.tmx'},{'revision':'d25aa2ec62eba0ff38dc1af07115ff04','url':'assets/json/levels/level2.json'},{'revision':'37f81768604950ea03d56c1ab27bd2d8','url':'assets/json/levels/level2.tmx'},{'revision':'1768da58f261e4c8eca524923c78d26e','url':'assets/json/levels/level3.json'},{'revision':'3fbc17250a99b81b8fdd99cb2ae5428d','url':'assets/json/levels/level3.tmx'},{'revision':'1a0561996a3402fbbfc377e0f6c0b1e2','url':'assets/json/levels/level4.json'},{'revision':'ac0191d1243255d7d7607c2d63007007','url':'assets/json/levels/level4.tmx'},{'revision':'9a13233a3ccb69057488397c05e7e633','url':'assets/json/levels/level5.json'},{'revision':'d4180e146dbb3b84577b6aa1ab868680','url':'assets/json/levels/level5.tmx'},{'revision':'2f8454b950724a9a292378d7c727cc9a','url':'assets/json/levels/level6.json'},{'revision':'894b35ec227e377f826f7f5429413801','url':'assets/json/levels/level6.tmx'},{'revision':'2f99355e650c0af0b2d857cfc4fbf4ef','url':'assets/json/levels/level7.json'},{'revision':'7ec26bf15c2246ff42dc6cef0e1a90d1','url':'assets/json/levels/level7.tmx'},{'revision':'6aeeab66f396c2d0bcef30b705300ff5','url':'assets/json/levels/paradoxe.tiled-project'},{'revision':'07252c5b7aa33858a515451a02f18063','url':'assets/json/levels/paradoxe.tiled-session'},{'revision':'a1971bd046de9df20c4267ff0258ec5a','url':'assets/json/levels/tileset.json'},{'revision':'47d7f584b0363f7b161e4d3010b9047d','url':'assets/json/levels/title.json'},{'revision':'958c37c3cdc2fc4b6479382e623302aa','url':'assets/json/objects/simple_bullet_atlas.json'},{'revision':'3e8f2d063358817efbaf1a1006573d7c','url':'assets/json/options/translations.json'},{'revision':'a4d7fb0d9aca78bc158734d8e38881ae','url':'assets/json/particles/simple_gun_shot.json'},{'revision':'f062e71fa8ac7b745e9e5e05f337515f','url':'assets/sounds/death.wav'},{'revision':'77a9b6683e0e6d19bb23067a361f7a46','url':'assets/sounds/door_close.wav'},{'revision':'aae78736e3268357be169b3628b0585c','url':'assets/sounds/door_open.wav'},{'revision':'43c1caab2849173ce988e28eecbd3c7a','url':'assets/sounds/door_tp.wav'},{'revision':'25f989ffbe6b7d0dc4bb38ed62beaae6','url':'assets/sounds/end_level.wav'},{'revision':'50f19a951c1985bcc2910db9d7979443','url':'assets/sounds/simple_gun_shot.wav'},{'revision':'cb2f85d4f5dbdfedf8fa4f08d725cb7d','url':'assets/sounds/switcher.wav'},{'revision':'45231d53594187305dd58c0876a85198','url':'assets/sounds/tp.wav'},{'revision':'26f448caf18776a118fc64eced8750e7','url':'assets/sounds/walk.wav'},{'revision':'57040e5677322118f6d56a1d9e43c5c6','url':'favicon.ico'},{'revision':'2ffbc23293ee8a797bc61e9c02534206','url':'icons/icons-192.png'},{'revision':'8bdcc486cda9b423f50e886f2ddb6604','url':'icons/icons-512.png'},{'revision':'0ef49473f8b576e4db852748179753d3','url':'index.html'},{'revision':null,'url':'main.d10a11723d5c688769c6.bundle.js'},{'revision':'bce522c56cb3f14ea2e70f00ad566f9d','url':'main.d10a11723d5c688769c6.bundle.js.LICENSE.txt'},{'revision':'bf38d0c9760162342f12cd9b44fbf4ef','url':'manifest.json'},{'revision':null,'url':'vendors.2619540065e9785c5258.bundle.js'},{'revision':'d520481d003c406e0c0f40dfe8782b6b','url':'vendors.2619540065e9785c5258.bundle.js.LICENSE.txt'}],m().precache(U),function(t){const s=m();!function(t,s,a){let n;if("string"==typeof t){const e=new URL(t,location.href);n=new R((({url:t})=>t.href===e.href),s,a)}else if(t instanceof RegExp)n=new v(t,s,a);else if("function"==typeof t)n=new R(t,s,a);else{if(!(t instanceof R))throw new e("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});n=t}(b||(b=new C,b.addFetchListener(),b.addCacheListener()),b).registerRoute(n)}(new q(s,t))}(undefined)})()})();