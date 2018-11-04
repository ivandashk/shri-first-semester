import Actions from "./flux/Actions.js";
import Store from "./flux/Store.js";

const initHeader = () => {
    const indexPageLink = cast(document.getElementById("index-link"), HTMLElement);
    const videoPageLink = cast(document.getElementById("video-link"), HTMLElement);
    const store = Store;
    store.addChangeListener(showNoRerenderMessage);

    indexPageLink.addEventListener("click", () => {
        Actions.changePage("index.html");
    });

    videoPageLink.addEventListener("click", () => {
        Actions.changePage("video.html");
    });
};

const showNoRerenderMessage = () => {
    // tslint:disable-next-line:no-console
    console.log("No re-render here");
};

initHeader();
