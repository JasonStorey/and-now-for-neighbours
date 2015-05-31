var tag,
    firstScriptTag,
    prePlayer,
    postPlayer;

tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function addCuePoint(player, seconds, onCuePoint) {
    if(player.getCurrentTime() >= seconds) {
        onCuePoint(player);
    } else {
        setTimeout(function(){
            addCuePoint(player, seconds, onCuePoint);
        }, 100);
    }
}

function onYouTubeIframeAPIReady() {
    prePlayer = createYTPlayer({
        elementId: 'prePlayer',
        videoId: 'dSXhZItSVpI',
        onReady: function(event) {
            var duration = event.target.getDuration();

            addCuePoint(event.target, duration - 3, function() {
                event.target.getIframe().className += " invisible";
                event.target.setVolume(0);

                postPlayer.playVideo();
                postPlayer.setVolume(100);
            });
            addCuePoint(event.target, duration - 1, function() {
                event.target.stopVideo();
                event.target.getIframe().className += " hidden";
            });
            event.target.playVideo();
        }
    });

    postPlayer = createYTPlayer({
        elementId: 'postPlayer',
        videoId: 'zJLGEE-VeJo',
        start: 26,
        onReady: function(event) {
            event.target.setVolume(0);
            event.target.playVideo();
            event.target.pauseVideo();
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        console.log('playing');
    }
}

function createYTPlayer(options) {
    return new YT.Player(options.elementId, {
        height: '390',
        width: '640',
        videoId: options.videoId,
        playerVars: {
            'autoplay': 0,
            'autohide': 1,
            'start': options.start || 0
        },
        events: {
            'onReady': options.onReady,
            'onStateChange': onPlayerStateChange
        }
    });
}
