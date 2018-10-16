const activeVideoModule = (function() {
    //Модуль для работы с активным видео
    let activeVideo = undefined;

    const controls = document.getElementById('video-controls');
    const brightnessInput = document.getElementById('brightness-input');
    const contrastInput = document.getElementById('contrast-input');

    // Объект с пользовательскими настройками всех видео
    const customSettings = {};

    const setInitialSettings = (video) => {
        // Устанавливаем начальные значения настроек
        const id = video.id;
        customSettings[id] = {};
        customSettings[id].brightness = 100;
        customSettings[id].contrast = 100;
        initializeAudioContext(video, customSettings[id]);
    };

    const toggleControls = () => {
        // Скрываем/показываем контролы для видео
        controls.classList.toggle("video-controls_opened");
        if (activeVideo) {
            brightnessInput.value = customSettings[activeVideo.id].brightness;
            contrastInput.value = customSettings[activeVideo.id].contrast;
        }
    };

    const assignControlsEventHandlers = () => {
        // Назначаем обработчики событий 
        brightnessInput.addEventListener('input', brightnessListener);
        contrastInput.addEventListener('input', contrastListener);
    };

    const removeControlsEventHandlers = () => {
        // Снимаем обработчики событий 
        brightnessInput.removeEventListener('input', brightnessListener)
        contrastInput.removeEventListener('input', contrastListener)
    };

    const brightnessListener = (e) => {
        // Слушатель события изменения контрола яркости
        customSettings[activeVideo.id].brightness = e.target.value;
        updateFilter(activeVideo);
    };
    
    const contrastListener = (e) => {
        // Слушатель события изменения контрола контраста
        customSettings[activeVideo.id].contrast = e.target.value;
        updateFilter(activeVideo);
    };

    const updateFilter = () => {
        // Обновляем фильтр на видео в соответствии с новыми значениями
        activeVideo.style.filter = `brightness(${customSettings[activeVideo.id].brightness}%) 
            contrast(${customSettings[activeVideo.id].contrast}%)`;
    };

    const updateVolumeBar = () => {
        // Перерисовываем индикатор уровня звука, пока активен аудиоконтекст
        const audioData = customSettings[activeVideo.id].audioData;

        const draw = () => {
            if (audioData.audioCtx.state !== 'running') return;

            requestAnimationFrame(draw);
            
            audioData.analyser.getByteFrequencyData(audioData.dataArray);
            audioData.volumePercent = parseInt(Math.max.apply(null, audioData.dataArray) / 255 * 100);
            document.getElementById('volume').setAttribute('x2', `${audioData.volumePercent}%`);
        }

        draw();
    };

    const initializeAudioContext = (video, settings) => {
        // Закрепляем за каждым видео его аудиоконтекст и настраиваем анализатор
        settings.audioData = {};
        let audioData = settings.audioData;
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

    const centerVideo = () => {
        // Центрируем видео
        const bottomOffset = 55;
    
        const centerX = document.body.clientWidth / 2;
        const centerY = document.body.clientHeight / 2 - bottomOffset;
    
        const videoStyle = window.getComputedStyle(activeVideo);
        const boundingRect = activeVideo.getBoundingClientRect();
        const transformOrigin = videoStyle.getPropertyValue('transform-origin').match(/\d+(.\d+)?/g);
        
        // Магический костыль
        const desktopScale = 2.8;
        const mobileScale = 1.1;
        const scale = document.body.clientWidth > 910 ? desktopScale : mobileScale;
    
        const pictureCenter = [boundingRect.x + parseFloat(transformOrigin[0]), boundingRect.y + parseFloat(transformOrigin[1])];
        const newTransformValue = `translate(${centerX - pictureCenter[0]}px, ${centerY - pictureCenter[1]}px) scale(${scale})`;
        activeVideo.style.transform = newTransformValue;
    };

    const measureFrameBrightness = () => {
        // Определить уровень освещенности оригинального видео
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // 4 значения на 1 пиксель: R, G, B, альфа-канал
        const valuesPerPixel = 4;
        // Точность измерений. От 1 до canvas.width. Больше коэффициент - больше точность, меньше производительность.
        const precision = 7;
        // Коэффициент некратности, обеспечивает эффект "лесенки" при выборе пикселей по высоте
        const aliquantRatio = 0.95;
        // Сколько пикселей пропускать при анализе
        const skipPixels = Math.ceil(aliquantRatio * canvas.width / precision);
        // На сколько значений в массиве должен сдвигаться итератор, чтобы переходить к следующему пикселю
        const skipValuesInArray = (skipPixels + 1) * valuesPerPixel;
        let imageData;

        const scan = () => {
            if (!activeVideo) return;

            requestAnimationFrame(scan);
            context.drawImage(activeVideo, 0, 0, canvas.width, canvas.height);
            imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
            // Сумма значений интенсивности серого цвета всех выбранных пикселей в кадре
            let pixelsLightLevelSum = 0;
            for (let i = 0; i < imageData.data.length; i += skipValuesInArray) {
                pixelsLightLevelSum += (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            }

            let lightLevelPercent = (pixelsLightLevelSum / (imageData.data.length / skipValuesInArray)) / 255 * 100;
            document.getElementById('light').setAttribute('x2', `${lightLevelPercent}%`);
        }
        scan();
    };

    const scanMovement = () => {
        // Определить уровень освещенности оригинального видео
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        activeVideo.parentElement.appendChild(canvas);
        canvas.style.zIndex = '20';
        context.strokeStyle = 'white';

        // 4 значения на 1 пиксель: R, G, B, альфа-канал
        const valuesPerPixel = 4;
        // Значения от 1 до 255. Чем меньше значение, тем выше чувствительность звхвата движения.
        const delta = 60;
        // Период обновления данных о движении (в кадрах)
        const captureFramePeriod = 10;

        context.drawImage(activeVideo, 0, 0, canvas.width, canvas.height);
        let prevImageData = [];

        let curFrame = captureFramePeriod;
        let topPixel, bottomPixel;
        let startX, startY, endX, endY;
        let curImagePixelLightLevel, prevImagePixelLightLevel;

        let scan = () => {
            if (!activeVideo) return;

            requestAnimationFrame(scan);
            context.drawImage(activeVideo, 0, 0, canvas.width, canvas.height);
            imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            if (prevImageData.length === 0) prevImageData = imageData;

            if (curFrame === 0) {
                topPixel = 0;
                bottomPixel = 0;

                for (let i = 0; i < imageData.data.length; i += valuesPerPixel) {
                    curImagePixelLightLevel = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                    prevImagePixelLightLevel = (prevImageData.data[i] + prevImageData.data[i + 1] + prevImageData.data[i + 2]) / 3;

                    // Если уровни серого на текущей и предыдущей картинке отличаются более,
                    // чем на дельту, регистрируем движение
                    if (Math.abs(curImagePixelLightLevel - prevImagePixelLightLevel) > delta) {
                        if (!topPixel) topPixel = i / valuesPerPixel;
                        bottomPixel = i / valuesPerPixel; 
                    }
                }

                startX = topPixel % canvas.width;
                startY = topPixel / canvas.width;
                endX = bottomPixel % canvas.width - startX;
                endY = bottomPixel / canvas.width - startY;

                prevImageData = imageData;
                curFrame = captureFramePeriod;
            }

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            
            context.putImageData(imageData, 0, 0);
            context.rect(startX, startY, endX, endY);
            context.stroke();

            curFrame--;
        }

        scan();
    };

    const toggleCanvas = () => {
        const canvas = document.getElementById('canvas');
        // Показывать только на десктопе
        if (document.body.clientWidth > 910)
            canvas.classList.toggle('video-page__canvas_opened');
    };

    return {
        toggleVideoActivity: (video) => {
            // Переключиаем активность видео
            if(!customSettings[video.id]) {
                setInitialSettings(video);
            }

            video.classList.toggle("video-page__video_opened");

            if (!activeVideo) {
                activeVideo = video;
                customSettings[activeVideo.id].audioData.audioCtx.resume().then(() => {
                    updateVolumeBar();
                });
                centerVideo();
                assignControlsEventHandlers();
                measureFrameBrightness();
                scanMovement();
                activeVideo.muted  = false;
            } else {
                customSettings[activeVideo.id].audioData.audioCtx.suspend();
                activeVideo.style.transform = "";
                activeVideo.muted  = true;
                removeControlsEventHandlers();
                activeVideo = undefined;
            }

            toggleCanvas();
            toggleControls();
        }
    }
  }());