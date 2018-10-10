function initVideo(video, url) {
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });

        let isActive = false;

        video.addEventListener('click', () => {
            if(!video.audioAnalyser) {
                initializeAudioContext(video);
            }
            video.classList.toggle("video-page__video_opened");
            document.getElementById('video-controls').classList.toggle("video-controls_opened");
            if (!isActive) {
                isActive = true;
                video.audioAnalyser.audioCtx.resume().then(() => {
                    updateVolumeBar(video);
                });
                
                video.muted  = false;
                centerVideo(video);
            } else {
                video.audioAnalyser.audioCtx.suspend();
                video.style.transform = "";
                video.muted  = true;
                isActive = false;
            }
        })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
        video.addEventListener('loadedmetadata', function () {
            video.play();
        });
    }
}

const initializeAudioContext = (video) => {
    video.audioAnalyser = {};
    video.audioAnalyser.audioCtx = new AudioContext();
    const source = video.audioAnalyser.audioCtx.createMediaElementSource(video);
    video.audioAnalyser.analyser = video.audioAnalyser.audioCtx.createAnalyser();
    video.audioAnalyser.analyser.smoothingTimeConstant = 0.9;
    source.connect(video.audioAnalyser.analyser);
    video.audioAnalyser.analyser.connect(video.audioAnalyser.audioCtx.destination);
    video.audioAnalyser.analyser.fftSize = 32;

    video.audioAnalyser.dataArray = new Uint8Array(video.audioAnalyser.analyser.frequencyBinCount);
    video.audioAnalyser.analyser.getByteFrequencyData(video.audioAnalyser.dataArray);
    video.audioAnalyser.volumePercent = 0;
}

const updateVolumeBar = (video) => {
    const draw = () => {
        if (video.audioAnalyser.audioCtx.state !== 'running') return;

        requestAnimationFrame(draw);
        
        video.audioAnalyser.analyser.getByteFrequencyData(video.audioAnalyser.dataArray);
        video.audioAnalyser.volumePercent = parseInt(Math.max.apply(null, video.audioAnalyser.dataArray) / 255 * 100);
        document.getElementById('volume').setAttribute('x2', `${video.audioAnalyser.volumePercent}%`);
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