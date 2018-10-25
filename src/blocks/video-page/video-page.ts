const initAllVideos = () => {
    // Инициализация всех видео
    const videosContainer = cast(document.getElementById("video-page"), HTMLElement);
    const videos = videosContainer.children;
    for (const video of videos) {
        initVideo(cast(video, HTMLVideoElement));
    }
};

function initVideo(video: HTMLVideoElement) {
    // Инициализация конкретного видео
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(video.src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
        });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = "https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8";
        video.addEventListener("loadedmetadata", () => {
            video.play();
        });
    }

    assignVideoEventHadlers(video);
}

const assignVideoEventHadlers = (video: HTMLVideoElement) => {
    // Назначаем обработчики событий на видео
    video.addEventListener("click", () => {
        activeVideoModule.toggleVideoActivity(video);
    });
};

const getAudioContext = (obj: any): obj is {
    // Получить аудиоконтекст
    webkitAudioContext: AudioContext;
    AudioContext: AudioContext;
} => {
    return obj.webkitAudioContext || obj.AudioContext;
};

let audioContext = getAudioContext(window);
if (!audioContext) { alert("Ваш браузер не поддерживает Web Audio API"); }

initAllVideos();
const activeVideoModule = new ActiveVideo();
