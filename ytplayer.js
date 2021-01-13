// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var dataElem;
var destroyed = false;
var currentVideoCode;
function onYouTubeIframeAPIReady() {
    if (destroyed)
        return;
    document.getElementsByClassName("channel-panels")[0].appendChild(document.getElementById("BDMCAplayer"));
    dataElem = document.getElementById("BDMCAdata");
    player = new YT.Player('BDMCAplayer', {
        height: '200',
        width: '200',
        videoId: dataElem.getAttribute("videocode"),
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    currentVideoCode = dataElem.getAttribute("videocode");
}

function onPlayerReady(event) {
    event.target.playVideo();
    setInterval(mainLoop, 100);
}
function mainLoop() {
    if(currentVideoCode != dataElem.getAttribute("videocode"))
    {
        player.loadVideoById(dataElem.getAttribute("videocode"));
        currentVideoCode = dataElem.getAttribute("videocode");
    }
    
    if (dataElem.getAttribute("destroyPlayer") === "true") {
        destroyed = true;
    }
    if (dataElem.getAttribute("videoplaying") === "true") {
        if (player.isMuted()) {
            player.unMute();
        }
        player.playVideo();
    }
    else {
        player.pauseVideo();
    }
    if (dataElem.getAttribute("videotime")) {
        var currStreamerTime = parseFloat(dataElem.getAttribute("videotime"));
        console.log(Math.abs(currStreamerTime - player.getCurrentTime()));
        if (Math.abs(currStreamerTime - player.getCurrentTime()) > 0.50) {
            player.seekTo(currStreamerTime, true);
        }


    }
    player.setVolume(parseFloat(dataElem.getAttribute("volumeMultiplier")));


}
// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {

        done = true;
    }
}
function stopVideo() {
    player.stopVideo();
}