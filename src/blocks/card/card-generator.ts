import CardEvent from "./card-event.js";
import CardDataButtons from "./CardData/CardDataButtons.js";
import CardDataMeasurements from "./CardData/CardDataMeasurements.js";
import CardDataMusic from "./CardData/CardDataMusic.js";

const appendDiv = (parent: HTMLElement): HTMLDivElement => {
    const div = document.createElement("div");
    parent.appendChild(div);
    return div;
};

const createCard = (): HTMLDivElement => {
    const ribbon = cast(document.getElementById("ribbon"), HTMLElement);
    const card = appendDiv(ribbon);
    card.classList.add("card");
    return card;
};

const setSize = (size: string, card: HTMLElement) => {
    card.classList.add(`card_${size}`);
};

const setType = (event: CardEvent, card: HTMLElement) => {
    if (event.isCritical) {
        card.classList.add("card_critical");
    }
    if (event.hasImage) {
        card.classList.add("card_with-image");
    }
};

const setCardHeader = (event: CardEvent, card: HTMLElement) => {
    const header = appendDiv(card);
    header.classList.add("card__row");

    const icon = document.createElement("img");
    icon.classList.add("card__image", "card__image_icon");
    let iconName = event.icon + event.iconTheme;
    icon.src = `./images/${iconName}.svg`;
    header.appendChild(icon);

    const title = appendDiv(header);
    title.innerHTML = trimTitle(event.title, event.size);
    title.classList.add("card__title");

    const close = document.createElement("img");
    close.classList.add("card__close");
    iconName = "cross" + event.iconTheme;
    close.src = `./images/${iconName}.svg`;
    header.appendChild(close);
};

const trimTitle = (str: string, cardSize: string): string => {
    let allowedCharWidth = 20;
    switch (cardSize) {
        case "l":
        case "m":
            allowedCharWidth = 50;
            break;
        case "s":
            allowedCharWidth = 20;
            break;
    }
    if (str.length < allowedCharWidth) { return str; }

    return str.slice(0, allowedCharWidth) + "...";
};

const setBasicInfo = (event: CardEvent, card: HTMLElement) => {
    const basicInfo = appendDiv(card);
    basicInfo.classList.add("card__basic-info");
    if (event.size === "s") {
        basicInfo.classList.add("card__basic-info_s");
    }
    if (event.isCritical) {
        basicInfo.classList.add("card__basic-info_with-bottom-margin");
    }

    const device = appendDiv(basicInfo);
    device.innerHTML = event.source;

    const time = appendDiv(basicInfo);
    time.innerHTML = event.time;
};

const appendCriticalDetails = (card: HTMLElement): HTMLDivElement => {
    const details = appendDiv(card);
    details.classList.add("card__details");
    return details;
};

const appendDescription = (event: CardEvent, card: HTMLElement) => {
    if (!event.description) { return; }

    const description = appendDiv(card);
    if (event.size === "l") {
        description.classList.add("card__description_l");
    }
    if (!event.isCritical) {
        description.classList.add("card__description");
    }
    description.innerHTML = event.description;
};

const appendPlayer = (data: CardDataMusic, card: HTMLElement) => {
    const player = cast(document.getElementById("player"), HTMLTemplateElement);
    const logo = cast(player.content.querySelector(".player__logo"), HTMLImageElement);
    const name = cast(player.content.querySelector(".player__name"), HTMLElement);
    const trackLength = cast(player.content.querySelector(".player__value_time"), HTMLElement);
    const volume = cast(player.content.querySelector(".player__value_volume"), HTMLElement);

    logo.src = data.albumcover;
    name.innerHTML = `${data.artist} - ${data.track.name}`;
    trackLength.innerHTML = data.track.length.toString();
    volume.innerHTML = `${data.volume}%`;
    const clone = document.importNode(player.content, true);
    card.appendChild(clone);
};

const appendAttachedImage = (event: CardEvent, card: HTMLElement) => {
    const container = appendDiv(card);
    container.classList.add("card__image-container");

    if (event.icon === "cam") {
        const camera = appendDiv(container);
        camera.setAttribute("id", "camera");
        camera.setAttribute("touch-action", "none");
        camera.classList.add("card__image_camera");

        const progress = document.createElement("progress");
        progress.setAttribute("id", "camera-progress");
        progress.classList.add("card__camera-interface", "card__progress");
        progress.setAttribute("max", "100");
        progress.setAttribute("value", "50");
        container.appendChild(progress);
    } else {
        const image = document.createElement("img");
        image.classList.add("card__image", "card__image_attachement");
        image.src = "./images/Richdata@3x.png";
        image.srcset = "./images/Richdata.png 590w, ./images/Richdata@2x.png 1080w, ./images/Richdata@3x.png 1770w";
        image.sizes = "(max-width: 650px) 560px, (max-width: 910px) 910px, 1100px";
        container.appendChild(image);
    }
};

const appendButtons = (data: CardDataButtons, card: HTMLElement) => {
    const buttonRow = appendDiv(card);
    buttonRow.classList.add("card__row");

    data.buttons.forEach((buttonText: string, i: number) => {
        const button = appendDiv(buttonRow);
        button.classList.add("card__button");
        if (i === 0) {
            button.classList.add("card__button_accent");
        }
        button.innerHTML = buttonText;
    });
};

const appendMeasurements = (data: CardDataMeasurements, card: HTMLElement) => {
    const measurements = appendDiv(card);
    measurements.classList.add("card__measurements");

    const templates = [
        ["temperature", "Температура:&nbsp;", " C"],
        ["humidity", "Влажность:&nbsp;", "%"],
    ];

    templates.forEach((template) => {
        const measurement = cast(document.getElementById("measurement"), HTMLTemplateElement);
        const text = cast(measurement.content.querySelector(".measurement__text"), HTMLElement);
        const value = cast(measurement.content.querySelector(".measurement__value"), HTMLElement);

        text.innerHTML = template[1];
        value.innerHTML = data[template[0]] + template[2];
        const clone = document.importNode(measurement.content, true);
        measurements.appendChild(clone);
    });
};

const markLastElementInCard = (card: HTMLElement) => {
    const lastChild = cast(card.lastElementChild, HTMLElement);
    if (lastChild.classList.length === 1 && lastChild.classList.contains("card__expander-row")) { return; }
    lastChild.classList.add("card__last-element");
};

const placeExpandButton = (card: HTMLElement) => {
    const expand = document.createElement("img");
    expand.classList.add("card__expand");
    expand.src = `./images/next.svg`;

    const lastChild = cast(card.lastElementChild, HTMLElement);

    let expandableSibling: HTMLElement;
    if (lastChild.classList.contains("card__basic-info")) {
        expand.classList.add("card__expand_absolute");
        expandableSibling = card;
    } else if (lastChild.classList.contains("player")
    || lastChild.classList.contains("card__image-container")
    || lastChild.classList.contains("card__measurements")) {
        const preLastChild = cast(lastChild.previousElementSibling, HTMLElement);
        expandableSibling = preLastChild;
        expandableSibling.classList.add("card__expander-row");
    } else {
        expandableSibling = lastChild;
        expandableSibling.classList.add("card__expander-row");
    }

    expandableSibling.appendChild(expand);
};

const appendCameraInterface = (card: HTMLElement) => {
    const cameraInterface = appendDiv(card);
    cameraInterface.setAttribute("id", "camera-interface");
    cameraInterface.classList.add("card__measurements", "card__camera-interface");

    const zoom = appendDiv(cameraInterface);
    zoom.innerHTML = "Приближение: 0%";

    const brightness = appendDiv(cameraInterface);
    brightness.innerHTML = "Яркость: 100%";
};

const generateCards = (events: CardEvent[]) => {
    events.forEach((event) => {
        let card = createCard();
        setSize(event.size, card);
        setType(event, card);
        setCardHeader(event, card);
        setBasicInfo(event, card);

        if (event.isCritical) {
            card = appendCriticalDetails(card);
        }

        if (!!event.description) {
            appendDescription(event, card);
        }
        if (event.data instanceof CardDataMusic) {
            appendPlayer(event.data, card);
        }
        if (event.hasImage) {
            appendAttachedImage(event, card);
        }
        if (event.data instanceof CardDataButtons) {
            appendButtons(event.data, card);
        }
        if (event.data instanceof CardDataMeasurements) {
            appendMeasurements(event.data, card);
        }

        placeExpandButton(card);
        markLastElementInCard(card);

        if (event.icon === "cam") {
            appendCameraInterface(card);
        }
    });
};

export default generateCards;
