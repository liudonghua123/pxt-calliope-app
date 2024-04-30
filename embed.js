(function() {
    if (window.ksRunnerInit) return;

    // This line gets patched up by the cloud
    var pxtConfig = {
    "relprefix": "/pxt-calliope-app/",
    "verprefix": "",
    "workerjs": "/pxt-calliope-app/worker.js",
    "monacoworkerjs": "/pxt-calliope-app/monacoworker.js",
    "gifworkerjs": "/pxt-calliope-app/gifjs/gif.worker.js",
    "serviceworkerjs": "/pxt-calliope-app/serviceworker.js",
    "typeScriptWorkerJs": "/pxt-calliope-app/tsworker.js",
    "pxtVersion": "9.0.18",
    "pxtRelId": "localDirRelId",
    "pxtCdnUrl": "/pxt-calliope-app/",
    "commitCdnUrl": "/pxt-calliope-app/",
    "blobCdnUrl": "/pxt-calliope-app/",
    "cdnUrl": "/pxt-calliope-app/",
    "targetVersion": "0.0.0",
    "targetRelId": "",
    "targetUrl": "",
    "targetId": "calliopemini",
    "simUrl": "/pxt-calliope-app/simulator.html",
    "simserviceworkerUrl": "/pxt-calliope-app/simulatorserviceworker.js",
    "simworkerconfigUrl": "/pxt-calliope-app/workerConfig.js",
    "partsUrl": "/pxt-calliope-app/siminstructions.html",
    "runUrl": "/pxt-calliope-app/run.html",
    "docsUrl": "/pxt-calliope-app/docs.html",
    "multiUrl": "/pxt-calliope-app/multi.html",
    "asseteditorUrl": "/pxt-calliope-app/asseteditor.html",
    "skillmapUrl": "/pxt-calliope-app/skillmap.html",
    "authcodeUrl": "/pxt-calliope-app/authcode.html",
    "multiplayerUrl": "/pxt-calliope-app/multiplayer.html",
    "isStatic": true
};

    var scripts = [
        "/pxt-calliope-app/highlight.js/highlight.pack.js",
        "/pxt-calliope-app/marked/marked.min.js",
    ]

    if (typeof jQuery == "undefined")
        scripts.unshift("/pxt-calliope-app/jquery.js")
    if (typeof jQuery == "undefined" || !jQuery.prototype.sidebar)
        scripts.push("/pxt-calliope-app/semantic.js")
    if (!window.pxtTargetBundle)
        scripts.push("/pxt-calliope-app/target.js");
    scripts.push("/pxt-calliope-app/pxtembed.js");

    var pxtCallbacks = []

    window.ksRunnerReady = function(f) {
        if (pxtCallbacks == null) f()
        else pxtCallbacks.push(f)
    }

    window.ksRunnerWhenLoaded = function() {
        pxt.docs.requireHighlightJs = function() { return hljs; }
        pxt.setupWebConfig(pxtConfig || window.pxtWebConfig)
        pxt.runner.initCallbacks = pxtCallbacks
        pxtCallbacks.push(function() {
            pxtCallbacks = null
        })
        pxt.runner.init();
    }

    scripts.forEach(function(src) {
        var script = document.createElement('script');
        script.src = src;
        script.async = false;
        document.head.appendChild(script);
    })

} ())
