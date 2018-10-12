const initAllVideos = () => {
    // Инициализация всех видео
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
};

function initVideo(video, url) {
    // Инициализация конкретного видео
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(url);
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

    setInitialSettings(video);
    assignVideoEventHadlers(video);
}

const setInitialSettings = (video) => {
    // Устанавливаем используемые начальные значения 
    video.brightness = 100;
    video.contrast = 100;
    video.audioData = undefined;
};

const assignVideoEventHadlers = (video) => {
    // Назначаем обработчики событий на видео
    video.addEventListener('click', () => {
        if(!video.audioData) {
            initializeAudioContext(video);
        }

        toggleControls(video);
        toggleVideoActivity(video);
    })
};

const toggleVideoActivity = (video) => {
    // Переключиаем активность видео
    video.classList.toggle("video-page__video_opened");
    if (!activeVideo) {
        video.audioData.audioCtx.resume().then(() => {
            updateVolumeBar(video.audioData);
        });
        centerVideo(video);
        video.muted  = false;
        activeVideo = video;
    } else {
        video.audioData.audioCtx.suspend();
        video.style.transform = "";
        video.muted  = true;
        activeVideo = undefined;
    }
};

const initializeAudioContext = (video) => {
    // Закрепляем за каждым видео его аудиоконтекст и настраиваем анализатор
    video.audioData = {};
    let audioData = video.audioData;
    audioData.audioCtx = new AudioContext();

    const source = audioData.audioCtx.createMediaElementSource(video);
    audioData.analyser = audioData.audioCtx.createAnalyser();
    source.connect(audioData.analyser);
    audioData.analyser.connect(audioData.audioCtx.destination);

    audioData.analyser.smoothingTimeConstant = 0.9;
    audioData.analyser.fftSize = 32;

    audioData.dataArray = new Uint8Array(audioData.analyser.frequencyBinCount);
    audioData.analyser.getByteFrequencyData(audioData.dataArray);
    audioData.volumePercent = 0;
}

const centerVideo = (video) => {
    // Центрируем видео
    const bottomOffset = 55;

    const centerX = document.body.clientWidth / 2;
    const centerY = document.body.clientHeight / 2 - bottomOffset;

    const videoStyle = window.getComputedStyle(video);
    const boundingRect = video.getBoundingClientRect();
    let transformOrigin = videoStyle.getPropertyValue('transform-origin').match(/\d+(.\d+)?/g);
    
    // Магический костыль
    let scale = document.body.clientWidth > 910 ? 2.8 : 1.1;

    const pictureCenter = [boundingRect.x + parseFloat(transformOrigin[0]), boundingRect.y + parseFloat(transformOrigin[1])];
    const newTransformValue = `translate(${centerX - pictureCenter[0]}px, ${centerY - pictureCenter[1]}px) scale(${scale})`;
    video.style.transform = newTransformValue;
}

const toggleControls = (video) => {
    // Скрываем/показываем контролы для видео
    document.getElementById('video-controls').classList.toggle("video-controls_opened");
    if (!activeVideo) {
        brightnessInput.value = video.brightness;
        contrastInput.value = video.contrast;
    }
};

const assignControlsEventHandlers = () => {
    // Назначаем обработчики событий 
    brightnessInput.addEventListener('input', (e) => {
        activeVideo.brightness = e.target.value;
        updateFilter(activeVideo);
    })
    
    contrastInput.addEventListener('input', (e) => {
        activeVideo.contrast = e.target.value;
        updateFilter(activeVideo);
    })
};

const updateVolumeBar = (audioData) => {
    // Перерисовываем индикатор уровня звука, пока активен аудиоконтекст
    const draw = () => {
        if (audioData.audioCtx.state !== 'running') return;

        requestAnimationFrame(draw);
        
        audioData.analyser.getByteFrequencyData(audioData.dataArray);
        audioData.volumePercent = parseInt(Math.max.apply(null, audioData.dataArray) / 255 * 100);
        document.getElementById('volume').setAttribute('x2', `${audioData.volumePercent}%`);
    }

    draw();
}

const updateFilter = (video) => {
    // Обновляем фильтр на видео в соответствии с новыми значениями
    video.style.filter = `brightness(${video.brightness}%) contrast(${activeVideo.contrast}%)`;
}


const AudioContext = window.AudioContext || window.webkitAudioContext;
if (!AudioContext) alert('Ваш браузер не поддерживает Web Audio API');

initAllVideos();
let activeVideo = undefined;

const brightnessInput = document.getElementById('brightness-input');
const contrastInput = document.getElementById('contrast-input');
assignControlsEventHandlers();