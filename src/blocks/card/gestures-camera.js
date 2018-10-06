const camera = document.getElementById("camera");
const cameraInterface = document.getElementById("camera-interface");

const isTouchDevice = () => {
    return "ontouchstart" in document.documentElement;
}

const turnGestureInterfaceOn = () => {
    cameraInterface.classList.add('card__camera-interface_enabled');
}

const setGestures = () => {
    let currentGesture = null;

    const cameraState = {
        currentPosition: 0,
    };

    camera.addEventListener('pointerdown', (event) => {
        camera.setPointerCapture(event.pointerId);
        currentGesture = {
            startX: event.x,
            currentPosition: cameraState.currentPosition,
        };
    });

    camera.addEventListener('pointermove', (event) => {
        if (!currentGesture) return;

        const {startX, currentPosition} = currentGesture;
        const {x} = event;
        const dx = x - startX;
        camera.style.backgroundPositionX = `${currentPosition + dx}px`;
        cameraState.currentPosition = currentPosition + dx;
    });

    const moveToStartPosition = () => {
        if (!currentGesture) return;
        currentGesture = null;
    }

    camera.addEventListener('pointerup', moveToStartPosition);
    camera.addEventListener('pointercancel', moveToStartPosition);
}


if (isTouchDevice()) {
    turnGestureInterfaceOn();
    setGestures();
}
