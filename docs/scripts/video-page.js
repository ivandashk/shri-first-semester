function initVideo(video, url) {
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });

        video.brightness = 100;
        video.contrast = 100;

        video.addEventListener('click', () => {
            if(!video.audioData) {
                video.audioData = {};
                initializeAudioContext(video);
            }
            video.classList.toggle("video-page__video_opened");
            toggleControls(video);
            if (!activeVideo) {
                activeVideo = video;
                video.audioData.audioCtx.resume().then(() => {
                    updateVolumeBar(video.audioData);
                });
                
                video.muted  = false;
                centerVideo(video);
            } else {
                video.audioData.audioCtx.suspend();
                video.style.transform = "";
                video.muted  = true;
                activeVideo = undefined;
            }
        })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
        video.addEventListener('loadedmetadata', function () {
            video.play();
        });
    }
}

const toggleControls = (video) => {
    document.getElementById('video-controls').classList.toggle("video-controls_opened");
    if (!activeVideo) {
        brightnessInput.value = video.brightness;
        contrastInput.value = video.contrast;
    }
};

const initializeAudioContext = (video) => {
    let audioData = video.audioData;
    audioData.audioCtx = new AudioContext();
    const source = audioData.audioCtx.createMediaElementSource(video);
    audioData.analyser = audioData.audioCtx.createAnalyser();
    audioData.analyser.smoothingTimeConstant = 0.9;
    source.connect(audioData.analyser);
    audioData.analyser.connect(audioData.audioCtx.destination);
    audioData.analyser.fftSize = 32;

    audioData.dataArray = new Uint8Array(audioData.analyser.frequencyBinCount);
    audioData.analyser.getByteFrequencyData(audioData.dataArray);
    audioData.volumePercent = 0;
}

const updateVolumeBar = (audioData) => {
    const draw = () => {
        if (audioData.audioCtx.state !== 'running') return;

        requestAnimationFrame(draw);
        
        audioData.analyser.getByteFrequencyData(audioData.dataArray);
        audioData.volumePercent = parseInt(Math.max.apply(null, audioData.dataArray) / 255 * 100);
        document.getElementById('volume').setAttribute('x2', `${audioData.volumePercent}%`);
    }

    draw();
}

const centerVideo = (video) => {
    var centerX = document.body.clientWidth / 2;
    var centerY = document.body.clientHeight / 2 - 55;

    const videoStyle = window.getComputedStyle(video);
    const boundingRect = video.getBoundingClientRect();
    let transformOrigin = videoStyle.getPropertyValue('transform-origin').match(/\d+(.\d+)?/g);

    const pictureCenter = [boundingRect.x + parseFloat(transformOrigin[0]), boundingRect.y + parseFloat(transformOrigin[1])];
    const newTranslateValue = `translate(${centerX - pictureCenter[0]}px, ${centerY - pictureCenter[1]}px) scale(2.8)`;
    video.style.transform = newTranslateValue;
}

const updateFilter = (video) => {
    video.style.filter = `brightness(${video.brightness}%) contrast(${activeVideo.contrast}%)`;
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
if (!AudioContext) alert('Ваш браузер не поддерживает Web Audio API');

initVideo(
    document.getElementById('video-1'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8'
);

initVideo(
    document.getElementById('video-2'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8'
);

initVideo(
    document.getElementById('video-3'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8'
);

initVideo(
    document.getElementById('video-4'),
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
);

let activeVideo = undefined;

const brightnessInput = document.getElementById('brightness-input');
const contrastInput = document.getElementById('contrast-input');

brightnessInput.addEventListener('input', (e) => {
    activeVideo.brightness = e.target.value;
    updateFilter(activeVideo);
})

contrastInput.addEventListener('input', (e) => {
    activeVideo.contrast = e.target.value;
    updateFilter(activeVideo);
})