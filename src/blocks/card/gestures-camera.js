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

    const constants = {
        zoomSpeedModifier: 0.1,
        minimumBackgroundSize: 500,
        maximumBackgroundSize: 1000,
    };

    const cameraState = {
        currentBackgroundSize: 500,
        currentPosition: 0,
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
    });

    camera.addEventListener('pointermove', (event) => {
        switch (currentGesture.length) {
            case 0:
                return;
            case 1:
                panX(event);
                break;
            case 2:
                zoom(event);
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

    const zoom = (event) => {
        const {pointerId, x, y} = event;
        const movedfinger = pointerId === currentGesture[0].pointerId 
            ? currentGesture[0] 
            : currentGesture[1];
        const fixedfinger = movedfinger.pointerId === currentGesture[1].pointerId 
            ? currentGesture[0] 
            : currentGesture[1];

        const initialDistance = Math.sqrt(
            Math.pow(movedfinger.startX - fixedfinger.startX, 2) + 
            Math.pow(movedfinger.startY - fixedfinger.startY, 2));

        const newDistance = Math.sqrt(
            Math.pow(x - fixedfinger.startX, 2) + 
            Math.pow(y - fixedfinger.startY, 2));

        const zoom = (newDistance - initialDistance) * constants.zoomSpeedModifier;
        const newBackgroundSize = cameraState.currentBackgroundSize + zoom;

        if (newBackgroundSize < constants.minimumBackgroundSize || newBackgroundSize > constants.maximumBackgroundSize) return;

        cameraState.currentBackgroundSize = newBackgroundSize;
        camera.style.backgroundSize = `${cameraState.currentBackgroundSize}px`;

        const zoomPercentValue = Math.round((newBackgroundSize - constants.minimumBackgroundSize) 
            / (constants.maximumBackgroundSize - constants.minimumBackgroundSize) * 100);

        cameraInterface.firstElementChild.innerHTML = `Приближение: ${zoomPercentValue}%`;
    }

    const moveToStartPosition = () => {
        if (currentGesture.length === 0) return;
        currentGesture = [];
    }

    camera.addEventListener('pointerup', moveToStartPosition);
    camera.addEventListener('pointercancel', moveToStartPosition);
}


if (isTouchDevice()) {
    turnGestureInterfaceOn();
    setGestures();
}
