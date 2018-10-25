import { CurrentGesture, Pointer } from "./current-gesture.js"

export default class GesturesSetter {
    private camera: HTMLElement;
    private cameraInterface: HTMLElement;
    private cameraProgress: HTMLElement;
    private currentGesture: CurrentGesture;

    private constants = {
        zoomSpeed: 2,
        minimumBackgroundSize: 0,
        maximumBackgroundSize: 500,
        imageBorders: 160,
        progressMiddleValue: 50,
        progressSpeed: 3,
        panDelta: 10,
        pinchDelta: 35,
        rotateDelta: 30
    };

    private cameraState = {
        currentBackgroundSize: 0,
        currentPosition: 0,
        currentBrightness: 100
    };

    constructor(camera: HTMLElement, cameraInterface: HTMLElement, cameraProgress: HTMLElement) {
        this.camera = camera;
        const cameraStyle = window.getComputedStyle(camera);
        const initialBackgroundSize = parseInt(cameraStyle.getPropertyValue('background-size').slice(0, -2));
        this.cameraInterface = cameraInterface;
        this.cameraProgress = cameraProgress;
        this.turnGestureInterfaceOn();

        this.cameraState.currentBackgroundSize = initialBackgroundSize;
        this.constants.minimumBackgroundSize = initialBackgroundSize;
        this.constants.maximumBackgroundSize = initialBackgroundSize + 500;
        
        camera.addEventListener('pointerdown', this.onPointerDown);
        camera.addEventListener('pointermove', this.onPointerMove);
        camera.addEventListener('pointerup', this.cancelGesture);
        camera.addEventListener('pointercancel', this.cancelGesture);

        this.currentGesture = new CurrentGesture();
    }

    private turnGestureInterfaceOn = () => {
        this.cameraProgress.classList.add('card__camera-interface_enabled');
        this.cameraInterface.classList.add('card__camera-interface_enabled');
    }

    private onPointerDown = (event: PointerEvent) => {
        this.camera.setPointerCapture(event.pointerId);
        this.currentGesture.pointers.push(new Pointer(event.pointerId, event.x, event.y));

        if (!event.isPrimary) {
            this.currentGesture.initialFingerDistance = Math.sqrt(
                Math.pow(this.currentGesture.pointers[0].startX - this.currentGesture.pointers[1].startX, 2) + 
                Math.pow(this.currentGesture.pointers[0].startY - this.currentGesture.pointers[1].startY, 2));
        }
    }

    private onPointerMove = (event: PointerEvent) => {
        switch (this.currentGesture.name) {
            case 'pan':
                this.panX(event);
                break;
            case 'pinch':
                this.pinch(event);
                break;
            case 'rotate':
                this.rotate(event);
                break;
            default:
                this.recognizeGesture(event);
                break;
        }
    }

    private recognizeGesture = (event: PointerEvent) => {
        const fingersCount = this.currentGesture.pointers.length;
        switch (fingersCount) {
            case 1:
                this.panX(event);
                break;
            case 2:
                this.recognizeTwoFingerGesture(event);
                break;
            default:
                console.log('Unrecognized gesture');
                break;
        }
    }

    private recognizeTwoFingerGesture = (event: PointerEvent) => {
        if(!this.currentGesture.initialFingerDistance) return;

        const dx = this.calculateNewDistance(event) - this.currentGesture.initialFingerDistance;
        this.currentGesture.recognizeMoves++;

        if (Math.abs(dx) > this.constants.pinchDelta) {
            this.currentGesture.name = "pinch";
        } else if (this.currentGesture.recognizeMoves > this.constants.rotateDelta) {
            this.currentGesture.name = "rotate";
        }
    }

    private calculateNewDistance = (event: PointerEvent) => {
        const {pointerId, x, y} = event;
        const fixedFinger = pointerId !== this.currentGesture.pointers[0].pointerId 
            ? this.currentGesture.pointers[0] 
            : this.currentGesture.pointers[1];
        const movedFinger = pointerId !== this.currentGesture.pointers[0].pointerId
            ? this.currentGesture.pointers[1] 
            : this.currentGesture.pointers[0];

        movedFinger.startX = x;
        movedFinger.startY = y;

        return Math.sqrt(
            Math.pow(x - fixedFinger.startX, 2) + 
            Math.pow(y - fixedFinger.startY, 2));
    }

    private panX = (event: PointerEvent) => {
        this.currentGesture.recognizeMoves++;
        // Some time to place second finger if intended
        if (this.currentGesture.recognizeMoves > this.constants.panDelta) {
            this.currentGesture.name = 'pan';
        }

        if (!event.isPrimary) return;
        
        const {startX}  = this.currentGesture.pointers[0];
        const currentPosition = this.cameraState.currentPosition;
        const {x} = event;
        const dx = x - startX;

        if (currentPosition + dx < this.constants.imageBorders*(-1) || currentPosition + dx > this.constants.imageBorders) return;

        this.camera.style.backgroundPositionX = `${currentPosition + dx}px`;
        this.cameraState.currentPosition = currentPosition + dx;

        const progressValue = `${this.constants.progressMiddleValue - this.cameraState.currentPosition / this.constants.progressSpeed}`;
        this.cameraProgress.setAttribute('value', progressValue);
    }

    private pinch = (event: PointerEvent) => {
        if (!this.currentGesture.initialFingerDistance) return;

        const newDistance = this.calculateNewDistance(event);
        const zoomDelta = (newDistance - this.currentGesture.initialFingerDistance) * this.constants.zoomSpeed;
        this.currentGesture.initialFingerDistance = newDistance;

        const newBackgroundSize = this.cameraState.currentBackgroundSize + zoomDelta;
        if (newBackgroundSize < this.constants.minimumBackgroundSize || newBackgroundSize > this.constants.maximumBackgroundSize) return;

        this.cameraState.currentBackgroundSize = newBackgroundSize;
        this.camera.style.backgroundSize = `${newBackgroundSize}px`;

        const zoomPercentValue = Math.round((newBackgroundSize - this.constants.minimumBackgroundSize) 
            / (this.constants.maximumBackgroundSize - this.constants.minimumBackgroundSize) * 100);

        const zoomElement = cast(this.cameraInterface.firstElementChild, HTMLElement);
        zoomElement.innerHTML = `Приближение: ${zoomPercentValue}%`;
    }

    private rotate = (event: PointerEvent) => {
        const {x, y, isPrimary, pointerId} = event;
        if (isPrimary) return;

        const fixedFinger = pointerId !== this.currentGesture.pointers[0].pointerId 
            ? this.currentGesture.pointers[0] 
            : this.currentGesture.pointers[1];
        
        const fingerAtan = Math.atan2(fixedFinger.startY - y, fixedFinger.startX - x);

        if (!this.currentGesture.prevFingerAtan)
            this.currentGesture.prevFingerAtan = fingerAtan;

        const increment = fingerAtan - this.currentGesture.prevFingerAtan > 0 ? 1 : -1;
        this.currentGesture.prevFingerAtan = fingerAtan;

        if (this.cameraState.currentBrightness + increment < 0) return;

        this.cameraState.currentBrightness += increment;
        this.camera.style.webkitFilter = `brightness(${this.cameraState.currentBrightness}%)`;
        const brightness = cast(this.cameraInterface.lastElementChild, HTMLElement);
        brightness.innerHTML = `Яркость: ${this.cameraState.currentBrightness}%`;
    }

    private cancelGesture = (event: PointerEvent) => {
        if (this.currentGesture.pointers.length === 0) return;
        
        this.currentGesture.initialFingerDistance = undefined;
        this.currentGesture.prevFingerAtan = undefined;
        this.currentGesture.recognizeMoves = 0;

        // allow replace finger multiple times in rotation move
        if (event.type === 'pointerup' && this.currentGesture.name === "rotate") {
            this.currentGesture.pointers.pop();
            if (this.currentGesture.pointers.length === 0)
                this.currentGesture.name = "";
        } else {
            this.currentGesture.pointers = [];
            this.currentGesture.name = "";
        }
    }
}