const camera = document.getElementById("camera");
const cameraInterface = document.getElementById("camera-interface");

const isTouchDevice = () => {
    return "ontouchstart" in document.documentElement;
}

const turnGestureInterfaceOn = () => {
    cameraInterface.classList.add('card__camera-interface_enabled');
}

const setGestures = () => {
    let currentGesture = [];
    let initialFingerDistance = undefined;
    let deltaFingerAngle = undefined;

    const cameraStyle = window.getComputedStyle(camera);
    const initialBackgroundSize = parseInt(cameraStyle.getPropertyValue('background-size').slice(0, -2));

    const constants = {
        zoomSpeedModifier: 0.1,
        minimumBackgroundSize: initialBackgroundSize,
        maximumBackgroundSize: initialBackgroundSize + 500,
        zoomSensitivity: 3.5,
        rotationSensitivity: 2.5
    };

    const cameraState = {
        currentBackgroundSize: initialBackgroundSize,
        currentPosition: 0,
        currentBrightness: 100
    };

    camera.addEventListener('pointerdown', (event) => {
        camera.setPointerCapture(event.pointerId);
        currentGesture.push({
            pointerId: event.pointerId,
            startX: event.x,
            startY: event.y,
            currentBackgroundSize: cameraState.currentBackgroundSize,
            currentPosition: cameraState.currentPosition,
        });

        if (!event.isPrimary) {
            initialFingerDistance = Math.sqrt(
                Math.pow(currentGesture[0].startX - currentGesture[1].startX, 2) + 
                Math.pow(currentGesture[0].startY - currentGesture[1].startY, 2));
        }
    });

    camera.addEventListener('pointermove', (event) => {
        const fingersCount = currentGesture.length;
        switch (fingersCount) {
            case 0:
                return;
            case 1:
                panX(event);
                break;
            case 2:
                recognizeTwoFingerGesture(event);
                break;
        }
    });

    const panX = (event) => {
        const {startX, currentPosition}  = currentGesture[0];
        const {x} = event;
        const dx = x - startX;
        camera.style.backgroundPositionX = `${currentPosition + dx}px`;
        cameraState.currentPosition = currentPosition + dx;
    }

    const recognizeTwoFingerGesture = (event) => {
        const {pointerId, x, y} = event;
        const fixedFinger = pointerId !== currentGesture[0].pointerId 
            ? currentGesture[0] 
            : currentGesture[1];

        const newDistance = Math.sqrt(
            Math.pow(x - fixedFinger.startX, 2) + 
            Math.pow(y - fixedFinger.startY, 2));

        const zoomDelta = (newDistance - initialFingerDistance) * constants.zoomSpeedModifier;
        if (Math.abs(zoomDelta) > constants.zoomSensitivity) {
            pinch(zoomDelta);
        }

        if (event.isPrimary) return;
        const newFingerAngle = Math.atan2(fixedFinger.startY - y, fixedFinger.startX - x);
        if (!deltaFingerAngle) {
            deltaFingerAngle = newFingerAngle;
        } else {
            if (Math.abs(zoomDelta) > constants.rotationSensitivity) return;
            rotate(newFingerAngle - deltaFingerAngle > 0);
            deltaFingerAngle = newFingerAngle;
        }
}

    const rotate = (isClockwise) => {
        const increment = isClockwise ? 1 : -1;
        cameraState.currentBrightness += increment;
        camera.style.webkitFilter = `brightness(${cameraState.currentBrightness}%)`;
        cameraInterface.lastElementChild.innerHTML = `Яркость: ${cameraState.currentBrightness}%`;
    }

    const pinch = (zoomDelta) => {
        const newBackgroundSize = cameraState.currentBackgroundSize + zoomDelta;
        if (newBackgroundSize < constants.minimumBackgroundSize || newBackgroundSize > constants.maximumBackgroundSize) return;

        camera.style.backgroundSize = `${cameraState.currentBackgroundSize}px`;
        cameraState.currentBackgroundSize = newBackgroundSize;

        const zoomPercentValue = Math.round((newBackgroundSize - constants.minimumBackgroundSize) 
            / (constants.maximumBackgroundSize - constants.minimumBackgroundSize) * 100);
        cameraInterface.firstElementChild.innerHTML = `Приближение: ${zoomPercentValue}%`;
    }

    const moveToStartPosition = () => {
        if (currentGesture.length === 0) return;
        currentGesture = [];
        initialFingerDistance = undefined;
        deltaFingerAngle = undefined;
    }

    camera.addEventListener('pointerup', moveToStartPosition);
    camera.addEventListener('pointercancel', moveToStartPosition);
}


if (isTouchDevice()) {
    turnGestureInterfaceOn();
    setGestures();
}
