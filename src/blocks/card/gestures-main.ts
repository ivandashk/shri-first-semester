import GesturesSetter from "./gestures-setter.js";

const camera = cast(document.getElementById("camera"), HTMLElement);
const cameraInterface = cast(document.getElementById("camera-interface"), HTMLElement);
const cameraProgress = cast(document.getElementById("camera-progress"), HTMLElement);

const isTouchDevice = () => {
    return "ontouchstart" in cast(document.documentElement, HTMLElement);
};

if (isTouchDevice()) {
    const gestureObject = new GesturesSetter(camera, cameraInterface, cameraProgress);
}
