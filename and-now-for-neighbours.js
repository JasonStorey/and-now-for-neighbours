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

function getVideoId() {
    var vidId = 'NAFTDJH5vSc',
        vidUrl = getVidUrl();

    if(!vidUrl) {
        vidUrl = prompt('Enter YouTube URL', 'https://www.youtube.com/watch?v=' + vidId);
        window.location.search = 'vidUrl=' + encodeURIComponent(vidUrl);
    }

    return extractVideoId(vidUrl) || vidId;
}

function extractVideoId(url) {
    var video_id,
        ampersandPosition;

    if(!url) { return; }

    video_id = url.split('v=')[1];

    if(!video_id) { return; }

    ampersandPosition = video_id.indexOf('&');

    if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
    }

    return video_id;
}

function getVidUrl() {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]], pair[1] ];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }

    return query_string['vidUrl'] ? decodeURIComponent(query_string['vidUrl']) : undefined;
}

function onYouTubeIframeAPIReady() {
    prePlayer = createYTPlayer({
        elementId: 'prePlayer',
        videoId: getVideoId(),
        onReady: function(event) {
            var duration = event.target.getDuration();

            addCuePoint(event.target, duration - 3, function() {
                event.target.getIframe().className += " invisible";
                postPlayer.playVideo();
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
        videoId: 'Ozcf6l-kIfg',
        onReady: function(event) {
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
            'autohide': 1
        },
        events: {
            'onReady': options.onReady,
            'onStateChange': onPlayerStateChange
        }
    });
}
