var DisconnectResponse;function initWebappServiceWorker(){const e="@relprefix@".replace("---","").replace(/^\//,""),o=-1===e.indexOf("/"),t="makecode;"+e+";@pxtRelId@",i=["@targetUrl@/"+e,"@simUrl@","/pxt-calliope-app/semantic.js","/pxt-calliope-app/main.js","/pxt-calliope-app/pxtapp.js","/pxt-calliope-app/typescript.js","/pxt-calliope-app/marked/marked.min.js","/pxt-calliope-app/highlight.js/highlight.pack.js","/pxt-calliope-app/jquery.js","/pxt-calliope-app/pxtlib.js","/pxt-calliope-app/pxtcompiler.js","/pxt-calliope-app/pxtpy.js","/pxt-calliope-app/pxtblockly.js","/pxt-calliope-app/pxteditor.js","/pxt-calliope-app/pxtsim.js","/pxt-calliope-app/pxtembed.js","/pxt-calliope-app/pxtworker.js","/pxt-calliope-app/pxtweb.js","/pxt-calliope-app/blockly.css","/pxt-calliope-app/semantic.css","/pxt-calliope-app/rtlsemantic.css","/pxt-calliope-app/blockly/media/sprites.png","/pxt-calliope-app/blockly/media/click.mp3","/pxt-calliope-app/blockly/media/disconnect.wav","/pxt-calliope-app/blockly/media/delete.mp3","/pxt-calliope-app/vs/loader.js","/pxt-calliope-app/vs/base/worker/workerMain.js","/pxt-calliope-app/vs/basic-languages/bat/bat.js","/pxt-calliope-app/vs/basic-languages/cpp/cpp.js","/pxt-calliope-app/vs/basic-languages/python/python.js","/pxt-calliope-app/vs/basic-languages/markdown/markdown.js","/pxt-calliope-app/vs/editor/editor.main.css","/pxt-calliope-app/vs/editor/editor.main.js","/pxt-calliope-app/vs/editor/editor.main.nls.js","/pxt-calliope-app/vs/language/json/jsonMode.js","/pxt-calliope-app/vs/language/json/jsonWorker.js","/pxt-calliope-app/smoothie/smoothie_compressed.js","/pxt-calliope-app/images/Bars_black.gif","/pxt-calliope-app/gifjs/gif.js","/pxt-calliope-app/ai.2.min.js","/pxt-calliope-app/target.js","/pxt-calliope-app/music-editor/apple.png","/pxt-calliope-app/music-editor/burger.png","/pxt-calliope-app/music-editor/cake.png","/pxt-calliope-app/music-editor/car.png","/pxt-calliope-app/music-editor/cat.png","/pxt-calliope-app/music-editor/cherry.png","/pxt-calliope-app/music-editor/clam.png","/pxt-calliope-app/music-editor/computer.png","/pxt-calliope-app/music-editor/crab.png","/pxt-calliope-app/music-editor/dog.png","/pxt-calliope-app/music-editor/duck.png","/pxt-calliope-app/music-editor/egg.png","/pxt-calliope-app/music-editor/explosion.png","/pxt-calliope-app/music-editor/fish.png","/pxt-calliope-app/music-editor/ice-cream.png","/pxt-calliope-app/music-editor/lemon.png","/pxt-calliope-app/music-editor/snake.png","/pxt-calliope-app/music-editor/star.png","/pxt-calliope-app/music-editor/strawberry.png","/pxt-calliope-app/music-editor/taco.png","/pxt-calliope-app/music-editor/bass-clef.svg","/pxt-calliope-app/music-editor/treble-clef.svg","/pxt-calliope-app/fieldeditors.js","/pxt-calliope-app/editor.js","","@targetUrl@/pxt-calliope-app/monacoworker.js","@targetUrl@/pxt-calliope-app/worker.js"],n=a(""),c=a("%2Fpxt-calliope-app%2Fdocs%2Fstatic%2FCalliopeminieditor.svg;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2FLogo_Calliope_Woman.svg;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2Ficons%2Fapple-touch-icon.png;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2FMicrosoft-logo_rgb_c-white.png;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2Fcalliope%2Fhero%2Fhero.jpg;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2Fdownload%2Ftransfer.png;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2Fdownload%2Fconnect.png;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2Fdownload%2Fpair.png;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2Fdownload%2Fconnected.png;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2Fdownload%2Ffirmware.png;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2Fdownload%2Fincompatible.png;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2Fwinapp.PNG;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2Fprofile%2Fmicrobit-cloud.png;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2Fproviders%2Fgithub-mark.png;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2Fproviders%2Fmicrosoft-logo.svg;%2Fpxt-calliope-app%2Fdocs%2Fstatic%2Fproviders%2Fgoogle-logo.svg"),s=r(i.concat(c).map((e=>e.trim())).filter((e=>!!e&&0!==e.indexOf("@"))));let l=!1;function r(e){const o=[];for(const t of e)-1===o.indexOf(t)&&o.push(t);return o}function a(e){const o=String.fromCharCode(64)+"cdnUrl"+String.fromCharCode(64);return r(e.split(";").map((e=>decodeURIComponent(e).replace(o,"@cdnUrl@").trim())))}self.addEventListener("install",(e=>{o?(l=!0,console.log("Installing service worker..."),e.waitUntil(caches.open(t).then((e=>(console.log("Opened cache"),console.log("Caching:\n"+s.join("\n")),e.addAll(s).then((()=>e))))).then((e=>e.addAll(n).catch((e=>{console.log("Failed to cache hexfiles")})))).then((()=>self.skipWaiting())))):console.log("Skipping service worker install for unnamed endpoint")})),self.addEventListener("activate",(i=>{o?(console.log("Activating service worker..."),i.waitUntil(caches.keys().then((o=>{const i=o.filter((o=>{const i=function(e){const o=e.split(";");return 3!==o.length?null:o[1]}(o);return null===i||i===e&&o!==t}));return Promise.all(i.map((e=>caches.delete(e))))})).then((()=>l?(l=!1,function(){const o=self;return o.clients.claim().then((()=>o.clients.matchAll())).then((o=>{o.forEach((o=>o.postMessage({type:"serviceworker",state:"activated",ref:e})))}))}()):Promise.resolve())))):console.log("Skipping service worker activate for unnamed endpoint")})),self.addEventListener("fetch",(e=>{e.respondWith(caches.match(e.request).then((o=>o||fetch(e.request))))}))}function initWebUSB(){let e,o,t,i,n=0,c="idle";async function s(e){(await self.clients.matchAll()).forEach((o=>o.postMessage(e)))}function l(){let o;const i=new Promise((o=>{console.log("Waiting for disconnect "+e),t=o,s({type:"serviceworker",action:"packet-io-lock-disconnect",lock:e})})),n=new Promise((t=>{o=setTimeout((()=>{console.log("Timed-out disconnect request "+e),t(DisconnectResponse.TimedOut)}),5e3)}));return Promise.race([i,n]).then((e=>(clearTimeout(o),t=void 0,e)))}function r(e){return new Promise((o=>{setTimeout(o,e)}))}self.addEventListener("message",(async a=>{const b=a.data;if("serviceworkerclient"===(null==b?void 0:b.type))if("request-packet-io-lock"===b.action){if(e||(e=await function(){if(e)return Promise.resolve(e);let o;const t=new Promise((e=>{console.log("check for existing lock"),i=e,s({type:"serviceworker",action:"packet-io-status"})})),n=new Promise((e=>{o=setTimeout((()=>{console.log("Timed-out check for existing lock"),e(void 0)}),1e3)}));return Promise.race([t,n]).then((e=>(clearTimeout(o),i=void 0,e)))}()),"granting"===c)return void await s({type:"serviceworker",action:"packet-io-lock-granted",granted:!1,lock:b.lock});console.log("Received lock request "+b.lock);const t=Date.now()-n;if(o=b.lock,t<4e3&&(c="waiting",console.log("Waiting to grant lock request "+b.lock),await r(4e3-t)),o!==b.lock)return console.log("Rejecting old lock request "+b.lock),void await s({type:"serviceworker",action:"packet-io-lock-granted",granted:!1,lock:b.lock});if(c="granting",e){let e;do{console.log("Sending disconnect request "+b.lock),e=await l(),e===DisconnectResponse.Waiting&&(console.log("Waiting on disconnect request "+b.lock),await r(1e3))}while(e===DisconnectResponse.Waiting)}console.log("Granted lock request "+b.lock),e=b.lock,await s({type:"serviceworker",action:"packet-io-lock-granted",granted:!0,lock:b.lock}),n=Date.now(),c="idle"}else"release-packet-io-lock"===b.action?(console.log("Received disconnect for "+e),e=void 0,t&&t(DisconnectResponse.Disconnected)):"packet-io-lock-disconnect"===b.action?(console.log("Received disconnect response for "+e),b.didDisconnect&&(e=void 0),t&&t(b.didDisconnect?DisconnectResponse.Disconnected:DisconnectResponse.Waiting)):"packet-io-supported"===b.action?await s({type:"serviceworker",action:"packet-io-supported",supported:!0}):"packet-io-status"===b.action&&b.hasLock&&i&&i(b.lock)}))}!function(e){e[e.Disconnected=0]="Disconnected",e[e.Waiting=1]="Waiting",e[e.TimedOut=2]="TimedOut"}(DisconnectResponse||(DisconnectResponse={})),initWebappServiceWorker(),initWebUSB();