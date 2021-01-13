var scriptUrl = 'https:\/\/www.youtube.com\/s\/player\/5dd3f3b2\/www-widgetapi.vflset\/www-widgetapi.js';
if (!window["YT"])
    var YT = { loading: 1, loaded: 0 };
if (!window["YTConfig"])
    var YTConfig = { "host": "https://www.youtube.com" };
if (true) {
    YT.loading = 1; (function () {
        var l = [];
        YT.ready = function (f) {
            if (YT.loaded) f();
            else l.push(f)
        };
        window.onYTReady = function () {
            YT.loaded = 1;
            for (var i = 0; i < l.length; i++) {
                try {
                    l[i]()
                }
                catch (e) { }
            }
        };
        YT.setConfig = function (c) {
            for (var k in c)
                if (c.hasOwnProperty(k))
                    YTConfig[k] = c[k]
        };
        var a = document.createElement("script");
        a.type = "text/javascript";
        a.id = "www-widgetapi-script";
        a.src = scriptUrl;
        a.async = true;
        var c = document.currentScript;
        if (c) {
            var n = c.nonce || c.getAttribute("nonce");
            if (n) a.setAttribute("nonce", n)
        }
        var b = document.getElementsByTagName("script")[0];
        b.parentNode.insertBefore(a, b);
        var d = document.createElement("script");
        d.type = "text/javascript";
        d.id = "www-bdmcaytapi-script";
        d.src = $("#BDMCAdata").attr("extensionpath") + "ytplayer.js";
        d.async = true;
        if (c) {
            var n = c.nonce || c.getAttribute("nonce");
            if (n) d.setAttribute("nonce", n)
        }
        b.parentNode.insertBefore(d, b.nextSibling);
    })()
};