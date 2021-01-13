/* in-content.js
*
* This file has an example on how to communicate with other parts of the extension through a long lived connection (port) and also through short lived connections (chrome.runtime.sendMessage).
*
* Note that in this scenario the port is open from the popup, but other extensions may open it from the background page or not even have either background.js or popup.js.
* */

// Extension port to communicate with the popup, also helps detecting when it closes
let port = null;

// Send messages to the open port (Popup)
const sendPortMessage = data => port.postMessage(data);

// Handle incoming popup messages
const popupMessageHandler = message => console.log('in-content.js - message from popup:', message);
const ytVideoIdentifier = "https://www.youtube.com/watch?v=";
const tVideoIdentifier = "https://www.twitch.tv/";
var qrTopLeftX = -1;
var qrTopLeftY = -1;
var qrSize = -1;
var currentVideoCode = "";
var lastTimeStamp = 0;
var failedDetectionAttempts = 0;


var streamerViewLoopInterval = 150; //QR and associated logic refresh speed
var viewerEndLoopInterval = 500; //Viewers end UI and associated logic refresh speed

var playerVolumeModifier = 100;
//main syncing/update loop

if (window.location.toString().includes(ytVideoIdentifier)) {
    streamerViewLoop();
}
else if (window.location.toString().includes(tVideoIdentifier)) {
    viewersEndLoop();
}

function streamerViewLoop() {
    if (document.getElementById("BDMCATTVsettings"))
        document.getElementById("BDMCATTVsettings").remove();
    var currTime = document.getElementsByClassName('video-stream')[0].currentTime;
    if ($('#BetterDMCA').length && $('#BDMCAsettings').css('animation-name') != 'openSettings') {
        var root = $('#BetterDMCA');
        var payload = window.location.toString().replace(ytVideoIdentifier, "").split("&")[0] + '|' + currTime.toFixed(2).toString();
        //console.log(payload);
        $('#BDMCAqrcode').empty();
        $('#BDMCAqrcode').show();
        var qrcode = new QRCode(document.getElementById("BDMCAqrcode"), {
            text: payload,
            width: 120,
            height: 120,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        setTimeout(streamerViewLoop, streamerViewLoopInterval);
    }
    else if ($('#BDMCAsettings').css('animation-name') === 'openSettings') {
        streamerViewLoopInterval = parseFloat(document.getElementById("BDMCAupdateInterval").value);
        document.getElementById("BDMCAupdateIntervalLabel").innerText = `QR Refresh: ${streamerViewLoopInterval.toFixed(0)}ms`;
        //100ms because we only update the UI so we want faster response time
        setTimeout(streamerViewLoop, 100);
    }
    else
        setTimeout(streamerViewLoop, 100);

}

function viewersEndLoop() {

    if ($('#BetterDMCA').length && $('video')[0].videoHeight > 0) {
        playerVolumeModifier = parseFloat(document.getElementById("BDMCAvolume").value);
        document.getElementById("BDMCAvolumeLabel").innerText = `${playerVolumeModifier.toFixed(0)}%`;
        var root = $('#BetterDMCA');
        if ($('#BDMCAqrcode'))
            $('#BDMCAqrcode').empty();

        //we use this to measure time taken for qr detection so that we can offset this when syncing audio with stream
        var t0 = performance.now();

        var video = $('video')[0];

        var canvas = document.createElement("canvas");
        // scale the canvas accordingly
        if (qrTopLeftX < 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }
        else {
            canvas.width = qrSize;
            canvas.height = qrSize;
        }
        // draw the video at that frame
        canvas.getContext('2d').drawImage(video, qrTopLeftX, qrTopLeftY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

        var imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        var code = jsQR(imageData.data, canvas.width, canvas.height, { inversionAttempts: "invertFirst" });

        if (code) {
            $('#BDMCAdata').attr("destroyPlayer", "false");
            //$('#BDMCAqrcode')[0].innerHTML += ("<p>" + code.data + "</p>");

            if (qrTopLeftX < 0) {
                qrTopLeftX = code.location.topLeftCorner.x;
                qrTopLeftY = code.location.topLeftCorner.y;
                qrSize = Math.abs(code.location.topLeftCorner.y - code.location.bottomLeftCorner.y);
            }
            else {

                var videoParams = code.data.split("|");
                if (currentVideoCode != videoParams[0]) {
                    $('#BDMCAplayer').empty();
                    if (!($('#www-widgetapi-script').length))
                        chrome.runtime.sendMessage('inityt', handleBackgroundResponse);
                    $('#BDMCAdata').attr("videocode", `${videoParams[0]}`);
                    $('#BDMCAdata').attr("videotime", `${parseFloat(videoParams[1]) - (performance.now() - t0)}`);
                    currentVideoCode = videoParams[0];
                }
                else {
                    if (lastTimeStamp === videoParams[1]) {
                        $('#BDMCAdata').attr("videoplaying", "false");
                    }
                    else {
                        $('#BDMCAdata').attr("videoplaying", "true");
                        lastTimeStamp = videoParams[1];
                    }
                    $('#BDMCAdata').attr("videotime", `${(parseFloat(videoParams[1]) - ((performance.now() - t0) / 1000)).toFixed(2)}`);
                    $('#BDMCAdata').attr("volumeMultiplier", `${playerVolumeModifier}`);
                }

            }
        }
        else {
            $('#BDMCAqrcode').hide();
            qrTopLeftX = -1;
            qrTopLeftY = -1;
            qrSize = -1;
            failedDetectionAttempts++;
            if (failedDetectionAttempts >= 3) {
                $('#BDMCAdata').attr("destroyPlayer", "true");
                $('#BetterDMCA').css('display', 'none');

                failedDetectionAttempts = 0;
            }
        }


    }
    else {
        /*
        if (!$('video')[0] || $('video')[0].videoHeight < 1) {
            setTimeout(function () {
                try {
                    document.getElementById('BetterDMCA').remove();
                    document.getElementById('BDMCAplayer').remove();
                }
                catch{}
            }, 2000);
        }
        */
    }
    setTimeout(viewersEndLoop, viewerEndLoopInterval);

}

// Start scripts after setting up the connection to popup
chrome.extension.onConnect.addListener(popupPort => {
    const targetNode = document.getElementsByClassName('ytp-time-current')[0];
    // Options for the observer (which mutations to observe)


    // Listen for popup messages
    popupPort.onMessage.addListener(popupMessageHandler);
    // Set listener for disconnection (aka. popup closed)
    popupPort.onDisconnect.addListener(() => {
        console.log('in-content.js - disconnected from popup');
        observer.disconnect();
    });
    // Make popup port accessible to other methods
    port = popupPort;
    // Perform any logic or set listeners
    sendPortMessage('message from in-content.js');

});

// Response handler for short lived messages
const handleBackgroundResponse = response =>
    console.log('in-content.js - Received response:', response);

// Send a message to background.js
chrome.runtime.sendMessage('Message from in-content.js!', handleBackgroundResponse);



// Later, you can stop observing
