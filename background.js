/* background.js
 *
 * This file has an example of how to make variables accessible to other scripts of the extension.
 *
 * It also shows how to handle short lived messages from other scripts, in this case, from in-content.js
 *
 * Note that not all extensions need of a background.js file, but extensions that need to persist data after a popup has closed may need of it.
 */

// A sample object that will be exposed further down and used on popup.js
const sampleBackgroundGlobal = {
    message: 'This object comes from background.js'
};

var currVersion = chrome.runtime.getManifest().version;

//we load HTML from files to make it easier to work with the code
var loadedHTMLYT;
$.ajax({
    url: chrome.runtime.getURL("controlpanel.html"),
    dataType: "html",
    success: function (data) {
        loadedHTMLYT = `if(!($('#BetterDMCA').length)){$('body').prepend($.parseHTML(atob(\"${btoa(data)}\").replaceAll('EXTENSIONID', '${chrome.runtime.id}').replaceAll('VERSION', '${currVersion}')));}`;
        console.log(loadedHTMLYT);
    }
});

var loadedHTMLTTV;
$.ajax({
    url: chrome.runtime.getURL("ttvcontrols.html"),
    dataType: "html",
    success: function (data) {
        loadedHTMLTTV = `if(!($('#BetterDMCA').length)){$('.chat-room__content').first().prepend($.parseHTML(atob(\"${btoa(data)}\").replaceAll('EXTENSIONID', '${chrome.runtime.id}').replaceAll('VERSION', '${currVersion}')));} else{$('#BetterDMCA').css('display', 'grid');}`;
        console.log(loadedHTMLTTV);
    }
});

// Make variables accessible from chrome.extension.getBackgroundPage()
window.sampleBackgroundGlobal = sampleBackgroundGlobal;
// Listen to short lived messages from in-content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Perform any ther actions depending on the message
    console.log('background.js - received message from in-content.js:', message);
    // Respond message
    var args = message.split("_")
    sendResponse('👍');
    if (args[0] === "inityt") {
        chrome.tabs.executeScript(null, { file: "jquery.min.js" }, function () {
            chrome.tabs.executeScript(null, { file: "yt_iframe_api.js" }, function () {
                // chrome.tabs.executeScript(null, { file: "ytplayer.js" });
            });
        });
    }
});

chrome.browserAction.onClicked.addListener(function (tab) {
   
    chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
        function (tabs) {
            var currentURL = tabs[0].url;
            if (currentURL.includes("youtube.com/watch")) {
                chrome.tabs.executeScript(null, { file: "jquery.min.js" }, function () {
                    chrome.tabs.executeScript(null, { code: loadedHTMLYT });
                });
            }
            else if (currentURL.includes("twitch.tv/")) {
                chrome.tabs.executeScript(null, { file: "jquery.min.js" }, function () {
                    chrome.tabs.executeScript(null, { code: loadedHTMLTTV });
                });
            }
        });


});


