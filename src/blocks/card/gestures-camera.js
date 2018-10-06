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
    let currentGestureName = "";
    let recognizeMoves = 0;

    const cameraStyle = window.getComputedStyle(camera);
    const initialBackgroundSize = parseInt(cameraStyle.getPropertyValue('background-size').slice(0, -2));

    let initialFingerDistance = undefined;
    let prevFingerAtan = undefined;

    const constants = {
        zoomSpeedModifier: 0.1,
        minimumBackgroundSize: initialBackgroundSize,
        maximumBackgroundSize: initialBackgroundSize + 500,
        zoomSensitivity: 1
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
        switch (currentGestureName) {
            case 'pan':
                panX(event);
                break;
            case 'pinch':
                pinch(event);
                break;
            case 'rotate':
                rotate(event);
                break;
            default:
                recognizeGesture(event);
                break;
        }
    });

    const recognizeGesture = (event) => {
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
    }

    const recognizeTwoFingerGesture = (event) => {
        const dx = calculateNewDistance(event) - initialFingerDistance;
        recognizeMoves++;

        if (Math.abs(dx) > 35) {
            currentGestureName = "pinch";
        } else if (recognizeMoves > 30) {
            currentGestureName = "rotate";
        }
    }

    const calculateNewDistance = (event) => {
        const {pointerId, x, y} = event;
        const fixedFinger = pointerId !== currentGesture[0].pointerId 
            ? currentGesture[0] 
            : currentGesture[1];
        const movedFinger = pointerId !== currentGesture[0].pointerId
            ? currentGesture[1] 
            : currentGesture[0];

        movedFinger.startX = x;
        movedFinger.startY = y;

        return Math.sqrt(
            Math.pow(x - fixedFinger.startX, 2) + 
            Math.pow(y - fixedFinger.startY, 2));
    }

    const panX = (event) => {
        recognizeMoves++;
        if (recognizeMoves > 10) {
            currentGestureName = 'pan';
        }

        if (!event.isPrimary) return;
        
        const {startX, currentPosition}  = currentGesture[0];
        const {x} = event;
        const dx = x - startX;
        camera.style.backgroundPositionX = `${currentPosition + dx}px`;
        cameraState.currentPosition = currentPosition + dx;
    }

    const pinch = (event) => {
        const newDistance = calculateNewDistance(event);
        const zoomDelta = (newDistance - initialFingerDistance) * 2;
        initialFingerDistance = newDistance;

        const newBackgroundSize = cameraState.currentBackgroundSize + zoomDelta;
        if (newBackgroundSize < constants.minimumBackgroundSize || newBackgroundSize > constants.maximumBackgroundSize) return;

        cameraState.currentBackgroundSize = newBackgroundSize;
        camera.style.backgroundSize = `${newBackgroundSize}px`;

        const zoomPercentValue = Math.round((newBackgroundSize - constants.minimumBackgroundSize) 
            / (constants.maximumBackgroundSize - constants.minimumBackgroundSize) * 100);
        cameraInterface.firstElementChild.innerHTML = `Приближение: ${zoomPercentValue}%`;
    }

    const rotate = (event) => {
        const {x, y, isPrimary, pointerId} = event;
        if (isPrimary) return;

        const fixedFinger = pointerId !== currentGesture[0].pointerId 
            ? currentGesture[0] 
            : currentGesture[1];
        
        const fingerAtan = Math.atan2(fixedFinger.startY - y, fixedFinger.startX - x);

        if (!prevFingerAtan)
            prevFingerAtan = fingerAtan;

        const increment = fingerAtan - prevFingerAtan > 0 ? 1 : -1;
        prevFingerAtan = fingerAtan;

        if (cameraState.currentBrightness + increment < 0) return;

        cameraState.currentBrightness += increment;
        camera.style.webkitFilter = `brightness(${cameraState.currentBrightness}%)`;
        cameraInterface.lastElementChild.innerHTML = `Яркость: ${cameraState.currentBrightness}%`;
    }

    const cancelGesture = () => {
        if (currentGesture.length === 0) return;
        currentGesture.pop();

        // allow replace finger multiple times in rotation move
        if (currentGestureName !== "rotate" || currentGesture.length === 0) {
            currentGestureName = "";
        }

        initialFingerDistance = undefined;
        prevFingerAtan = undefined;
        recognizeMoves = 0;
    }

    camera.addEventListener('pointerup', cancelGesture);
    camera.addEventListener('pointercancel', cancelGesture);
}


if (isTouchDevice()) {
    turnGestureInterfaceOn();
    setGestures();
}
