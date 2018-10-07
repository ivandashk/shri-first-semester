const appendDiv = (parent) => {
    const div = document.createElement("div");
    parent.appendChild(div);
    return div;
}

const getIconThemeByEventType = (iconName, eventType) => {
    if (!isCritical(eventType)) return iconName;
    return `${iconName}-white`;
}

const isCritical = (type) => {
    return type === 'critical';
}

const hasAttachedImage = (event) => {
    return !!event.data && (!!event.data.image || (!!event.data.type && event.data.type === 'graph'));
}

const createCard = () => {
    const ribbon = document.getElementById("ribbon");
    const card = appendDiv(ribbon);
    card.classList.add("card");
    return card;
}

const setSize = (event, card) => {
    card.classList.add(`card_${event.size}`);
}

const setType = (event, card) => {
    if (isCritical(event.type)) {
        card.classList.add('card_critical');
    }
    if (hasAttachedImage(event)) {
        card.classList.add('card_with-image');
    }
}

const setCardHeader = (event, card) => {
    const header = appendDiv(card);
    header.classList.add("card__row");

    const icon = document.createElement("img");
    icon.classList.add("card__image", "card__image_icon");
    let iconName = getIconThemeByEventType(event.icon, event.type);
    icon.src = `./images/${iconName}.svg`;
    header.appendChild(icon);

    const title = appendDiv(header);
    title.innerHTML = trimTitle(event.title, event.size);
    title.classList.add("card__title");
    
    const close = document.createElement("img");
    close.classList.add("card__close");
    iconName = getIconThemeByEventType('cross', event.type);
    close.src = `./images/${iconName}.svg`;
    header.appendChild(close);
}

const trimTitle = (str, cardSize) => {
    // The ugly way
    let allowedCharWidth = undefined;
    switch (cardSize) {
        case 'l':
        case 'm':
            allowedCharWidth = 50;
            break;
        case 's':
            allowedCharWidth = 20;
            break;
    };
    if (str.length < allowedCharWidth) return str;

    return str.slice(0, allowedCharWidth) + '...';
}

const setBasicInfo = (event, card) => {
    const basicInfo = appendDiv(card);
    basicInfo.classList.add("card__basic-info");
    if (event.size === 's') {
        basicInfo.classList.add("card__basic-info_s");
    }
    if (isCritical(event.type)) {
        basicInfo.classList.add("card__basic-info_with-bottom-margin");
    }

    const device = appendDiv(basicInfo);
    device.innerHTML = event.source;

    const time = appendDiv(basicInfo);
    time.innerHTML = event.time;
}

const appendCriticalDetails = (card) => {
    const details = appendDiv(card);
    details.classList.add("card__details");
    return details;
}

const appendDescription = (event, card) => {
    if (!event.description) return;

    const description = appendDiv(card);
    if (event.size === 'l') {
        description.classList.add("card__description_l");
    }
    if (!isCritical(event.type)) {
        description.classList.add("card__description");
    }
    description.innerHTML = event.description;
}

const appendPlayer = (event, card) => {
    if (!event.icon === 'music' || !event.data || !event.data.track) return;

    const player = document.getElementById('player');
    player.content.querySelector('.player__logo').src = event.data.albumcover;
    player.content.querySelector('.player__name').innerHTML = `${event.data.artist} - ${event.data.track.name}`;
    player.content.querySelector('.player__value_time').innerHTML = event.data.track.length;
    player.content.querySelector('.player__value_volume').innerHTML = `${event.data.volume}%`;
    const clone = document.importNode(player.content, true);
    card.appendChild(clone);
}

const appendAttachedImage = (event, card) => {
    if (!hasAttachedImage(event)) return;

    const container = appendDiv(card);
    container.classList.add("card__image-container");

    if (event.icon === 'cam') {
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
        image.src = './images/Richdata@3x.png';
        image.srcset = './images/Richdata.png 590w, ./images/Richdata@2x.png 1080w, ./images/Richdata@3x.png 1770w';
        image.sizes = '(max-width: 650px) 560px, (max-width: 910px) 910px, 1100px';
        container.appendChild(image);
    }
}

const appendButtons = (event, card) => {
    if (!event.data || !event.data.buttons) return;

    const buttonRow = appendDiv(card);
    buttonRow.classList.add("card__row");

    event.data.buttons.forEach((buttonText, i) => {
        const button = appendDiv(buttonRow);
        button.classList.add("card__button");
        if (i === 0) {
            button.classList.add("card__button_accent");
        }
        button.innerHTML = buttonText;
    });
}

const appendMeasurements = (event, card) => {
    if (!event.data || !event.data.temperature || !event.data.humidity) return;

    const measurements = appendDiv(card);
    measurements.classList.add("card__measurements");

    let measurementData = [];
    if (!!event.data.temperature) {
        measurementData.push(['temperature', 'Температура:&nbsp;', ' C']);
    }
    if (!!event.data.humidity) {
        measurementData.push(['humidity', 'Влажность:&nbsp;', '%']);
    }

    measurementData.forEach((data) => {
        const measurement = document.getElementById('measurement');
        measurement.content.querySelector('.measurement__text').innerHTML = data[1];
        measurement.content.querySelector('.measurement__value').innerHTML = event.data[data[0]] + data[2];
        const clone = document.importNode(measurement.content, true);
        measurements.appendChild(clone);
    });
}

const markLastElementInCard = (lastChild) => {
    if (lastChild.classList.length === 1 && lastChild.classList.contains('card__expander-row')) return;
    lastChild.classList.add("card__last-element");
}

const placeExpandButton = (card) => {
    const expand = document.createElement("img");
    expand.classList.add("card__expand");
    expand.src = `./images/next.svg`;
    
    let expandableSibling = undefined;
    if (card.lastElementChild.classList.contains('card__basic-info')) {
        expand.classList.add("card__expand_absolute");
        expandableSibling = card;
    } else if (card.lastElementChild.classList.contains('player') 
    || card.lastElementChild.classList.contains('card__image-container')
    || card.lastElementChild.classList.contains('card__measurements')) {
        expandableSibling = card.lastElementChild.previousElementSibling;
        expandableSibling.classList.add("card__expander-row");
    } else {
        expandableSibling = card.lastElementChild;
        expandableSibling.classList.add("card__expander-row");
    }

    expandableSibling.appendChild(expand);
}

const appendCameraInterface = (card) => {
    const cameraInterface = appendDiv(card);
    cameraInterface.setAttribute("id", "camera-interface");
    cameraInterface.classList.add("card__measurements", 'card__camera-interface');

    const zoom = appendDiv(cameraInterface);
    zoom.innerHTML = 'Приближение: 0%';

    const brightness = appendDiv(cameraInterface);
    brightness.innerHTML = 'Яркость: 100%';
}

const generateCards = (cardsData) => {
    cardsData.events.forEach((event) => {
        let card = createCard();
        setSize(event, card);
        setType(event, card);
        setCardHeader(event, card);
        setBasicInfo(event, card);

        if (isCritical(event.type))
            card = appendCriticalDetails(card);

        appendDescription(event, card);
        appendPlayer(event, card);
        appendAttachedImage(event, card);
        appendButtons(event, card);
        appendMeasurements(event, card);

        placeExpandButton(card);
        markLastElementInCard(card.lastElementChild);

        if (event.icon === 'cam') 
            appendCameraInterface(card);
    });
}

generateCards(data);