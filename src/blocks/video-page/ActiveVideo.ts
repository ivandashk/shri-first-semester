class ActiveVideo {
    // Модуль для работы с активным видео
    private controls = cast(document.getElementById("video-controls"), HTMLElement);
    private brightnessInput = cast(document.getElementById("brightness-input"), HTMLInputElement);
    private contrastInput = cast(document.getElementById("contrast-input"), HTMLInputElement);

    private activeVideo: HTMLVideoElement | undefined;
    private customSettings: CustomSettings = {};

    public toggleVideoActivity = (video: HTMLVideoElement) => {
        // Переключиаем активность видео
        if (!this.customSettings[video.id]) {
            this.setInitialSettings(video);
        }

        video.classList.toggle("video-page__video_opened");
        this.toggleControls();

        if (!this.activeVideo) {
            this.activeVideo = video;
            this.customSettings[this.activeVideo.id].audioData.audioCtx.resume().then(() => {
                this.updateVolumeBar();
            });
            this.centerVideo();
            this.assignControlsEventHandlers();
            this.measureFrameBrightness();
            this.scanMovement();
            this.activeVideo.muted  = false;
        } else {
            this.customSettings[this.activeVideo.id].audioData.audioCtx.suspend();
            this.activeVideo.style.transform = "";
            this.activeVideo.muted  = true;
            this.removeControlsEventHandlers();
            this.activeVideo = undefined;
        }

        this.toggleCanvas();
    }

    private setInitialSettings = (video: HTMLVideoElement) => {
        // Устанавливаем начальные значения настроек
        this.customSettings[video.id] = new SettingsSet(video);
    }

    private toggleControls = () => {
        // Скрываем/показываем контролы для видео
        this.controls.classList.toggle("video-controls_opened");
        if (this.activeVideo) {
            this.brightnessInput.value = this.customSettings[this.activeVideo.id].brightness.toString();
            this.contrastInput.value = this.customSettings[this.activeVideo.id].contrast.toString();
        }
    }

    private assignControlsEventHandlers = () => {
        // Назначаем обработчики событий
        this.brightnessInput.addEventListener("input", this.brightnessListener);
        this.contrastInput.addEventListener("input", this.contrastListener);
    }

    private removeControlsEventHandlers = () => {
        // Снимаем обработчики событий
        this.brightnessInput.removeEventListener("input", this.brightnessListener);
        this.contrastInput.removeEventListener("input", this.contrastListener);
    }

    private brightnessListener = (e: Event) => {
        // Слушатель события изменения контрола яркости
        if (!this.activeVideo) { return; }

        const target = cast(e.target, HTMLInputElement);
        this.customSettings[this.activeVideo.id].brightness = parseInt(target.value, 10);
        this.updateFilter();
    }

    private contrastListener = (e: Event) => {
        // Слушатель события изменения контрола контраста
        if (!this.activeVideo) { return; }

        const target = cast(e.target, HTMLInputElement);
        this.customSettings[this.activeVideo.id].contrast = parseInt(target.value, 10);
        this.updateFilter();
    }

    private updateFilter = () => {
        // Обновляем фильтр на видео в соответствии с новыми значениями
        if (!this.activeVideo) { return; }

        this.activeVideo.style.filter = `brightness(${this.customSettings[this.activeVideo.id].brightness}%)
            contrast(${this.customSettings[this.activeVideo.id].contrast}%)`;
    }

    private updateVolumeBar = () => {
        // Перерисовываем индикатор уровня звука, пока активен аудиоконтекст
        if (!this.activeVideo) { return; }

        const audioData = this.customSettings[this.activeVideo.id].audioData;

        const draw = () => {
            if (audioData.audioCtx.state !== "running") { return; }

            requestAnimationFrame(draw);

            audioData.analyser.getByteFrequencyData(audioData.dataArray);
            audioData.volumePercent = Math.max.apply(null, audioData.dataArray) / 255 * 100;

            const volume = document.getElementById("volume") as HTMLOrSVGImageElement;
            volume.setAttribute("x2", `${audioData.volumePercent}%`);
        };

        draw();
    }

    private centerVideo = () => {
        // Центрируем видео
        if (!this.activeVideo) { return; }

        const bottomOffset = 55;

        const centerX = document.body.clientWidth / 2;
        const centerY = document.body.clientHeight / 2 - bottomOffset;

        const videoStyle = window.getComputedStyle(this.activeVideo);
        const boundingRect = cast(this.activeVideo.getBoundingClientRect(), DOMRect);
        const transformOrigin = videoStyle.getPropertyValue("transform-origin").match(/\d+(.\d+)?/g);
        if (!transformOrigin) { return; }

        // Магический костыль
        const desktopScale = 2.8;
        const mobileScale = 1.1;
        const scale = document.body.clientWidth > 910 ? desktopScale : mobileScale;

        const pictureCenter = [boundingRect.x + parseFloat(transformOrigin[0]),
            boundingRect.y + parseFloat(transformOrigin[1])];
        const newTransformValue = `translate(${centerX - pictureCenter[0]}px, ${centerY - pictureCenter[1]}px)
            scale(${scale})`;
        this.activeVideo.style.transform = newTransformValue;
    }

    private measureFrameBrightness = () => {
        // Определить уровень освещенности оригинального видео
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) { return; }

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
            if (!this.activeVideo) { return; }

            requestAnimationFrame(scan);
            context.drawImage(this.activeVideo, 0, 0, canvas.width, canvas.height);
            imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            // Сумма значений интенсивности серого цвета всех выбранных пикселей в кадре
            let pixelsLightLevelSum = 0;
            for (let i = 0; i < imageData.data.length; i += skipValuesInArray) {
                pixelsLightLevelSum += (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            }

            const lightLevelPercent = (pixelsLightLevelSum / (imageData.data.length / skipValuesInArray)) / 255 * 100;
            const light = document.getElementById("light") as HTMLOrSVGImageElement;
            light.setAttribute("x2", `${lightLevelPercent}%`);
        };
        scan();
    }

    private scanMovement = () => {
        // Определить уровень освещенности оригинального видео
        if (!this.activeVideo) { return; }

        const canvas = cast(document.getElementById("canvas"), HTMLCanvasElement);
        const context = canvas.getContext("2d");
        if (!context) { return; }

        const videoContainer = cast(this.activeVideo.parentElement, HTMLElement);
        videoContainer.appendChild(canvas);
        canvas.style.zIndex = "20";
        context.strokeStyle = "white";

        // 4 значения на 1 пиксель: R, G, B, альфа-канал
        const valuesPerPixel = 4;
        // Значения от 1 до 255. Чем меньше значение, тем выше чувствительность звхвата движения.
        const delta = 60;
        // Период обновления данных о движении (в кадрах)
        const captureFramePeriod = 10;

        context.drawImage(this.activeVideo, 0, 0, canvas.width, canvas.height);
        let prevImageData: ImageData;

        let curFrame = captureFramePeriod;
        let topPixel: number;
        let bottomPixel: number;

        let startX: number;
        let startY: number;
        let endX: number;
        let endY: number;

        let curImagePixelLightLevel: number;
        let prevImagePixelLightLevel: number;

        const scan = () => {
            if (!this.activeVideo) { return; }

            requestAnimationFrame(scan);
            context.drawImage(this.activeVideo, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            if (!prevImageData) { prevImageData = imageData; }

            if (curFrame === 0) {
                topPixel = 0;
                bottomPixel = 0;

                for (let i = 0; i < imageData.data.length; i += valuesPerPixel) {
                    curImagePixelLightLevel = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                    prevImagePixelLightLevel = (prevImageData.data[i] +
                        prevImageData.data[i + 1] + prevImageData.data[i + 2]) / 3;

                    // Если уровни серого на текущей и предыдущей картинке отличаются более,
                    // чем на дельту, регистрируем движение
                    if (Math.abs(curImagePixelLightLevel - prevImagePixelLightLevel) > delta) {
                        if (!topPixel) { topPixel = i / valuesPerPixel; }
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
        };

        scan();
    }

    private toggleCanvas = () => {
        const canvas = cast(document.getElementById("canvas"), HTMLCanvasElement);
        // Показывать только на десктопе
        if (document.body.clientWidth > 910) {
            canvas.classList.toggle("video-page__canvas_opened");
        }
    }
}
