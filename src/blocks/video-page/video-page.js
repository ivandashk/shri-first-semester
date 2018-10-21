const initAllVideos = () => {
    // Инициализация всех видео
    var videos = document.getElementById('video-page').children;
    for (let i = 0; i < videos.length; i++) {
        initVideo(videos[i]);
    }
};

function initVideo(video) {
    // Инициализация конкретного видео
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(video.src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
        video.addEventListener('loadedmetadata', function () {
            video.play();
        });
    }

    assignVideoEventHadlers(video);
}

const assignVideoEventHadlers = (video) => {
    // Назначаем обработчики событий на видео
    video.addEventListener('click', () => {
        activeVideoModule.toggleVideoActivity(video);
    })
};

const AudioContext = window.AudioContext || window.webkitAudioContext;
if (!AudioContext) alert('Ваш браузер не поддерживает Web Audio API');

initAllVideos();