import Actions from "./flux/Actions.js";
import pageStore from "./flux/PageStore.js";

const initHeader = () => {
    const indexPageLink = cast(document.getElementById("index-link"), HTMLElement);
    const videoPageLink = cast(document.getElementById("video-link"), HTMLElement);
    pageStore.addChangeListener(showNoRerenderMessage);

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
