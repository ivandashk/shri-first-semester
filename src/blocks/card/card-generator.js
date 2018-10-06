const data = {
    "events": [
        {
            "type": "info",
            "title": "Еженедельный отчет по расходам ресурсов",
            "source": "Сенсоры потребления",
            "time": "19:00, Сегодня",
            "description": "Так держать! За последнюю неделю вы потратили на 10% меньше ресурсов, чем неделей ранее.",
            "icon": "stats",
            "data": {
                "type": "graph",
                "values": [
                    {
                        "electricity": [
                            ["1536883200", 115],
                            ["1536969600", 117],
                            ["1537056000", 117.2],
                            ["1537142400", 118],
                            ["1537228800", 120],
                            ["1537315200", 123],
                            ["1537401600", 129]
                        ]
                    },
                    {
                        "water": [
                            ["1536883200", 40],
                            ["1536969600", 40.2],
                            ["1537056000", 40.5],
                            ["1537142400", 41],
                            ["1537228800", 41.4],
                            ["1537315200", 41.9],
                            ["1537401600", 42.6]
                        ]
                    },
                    {
                        "gas": [
                            ["1536883200", 13],
                            ["1536969600", 13.2],
                            ["1537056000", 13.5],
                            ["1537142400", 13.7],
                            ["1537228800", 14],
                            ["1537315200", 14.2],
                            ["1537401600", 14.5]
                        ]
                    }
                ]
            },
            "size": "l"
        },
        {
            "type": "info",
            "title": "Дверь открыта",
            "source": "Сенсор входной двери",
            "time": "18:50, Сегодня",
            "description": null,
            "icon": "key",
            "size": "s"
        },
        {
            "type": "info",
            "title": "Уборка закончена",
            "source": "Пылесос",
            "time": "18:45, Сегодня",
            "description": null,
            "icon": "robot-cleaner",
            "size": "s"
        },
        {
            "type": "info",
            "title": "Новый пользователь",
            "source": "Роутер",
            "time": "18:45, Сегодня",
            "description": null,
            "icon": "router",
            "size": "s"
        },
        {
            "type": "info",
            "title": "Изменен климатический режим",
            "source": "Сенсор микроклимата",
            "time": "18:30, Сегодня",
            "description": "Установлен климатический режим «Фиджи»",
            "icon": "thermal",
            "size": "m",
            "data": {
                "temperature": 24,
                "humidity": 80
            }
        },
        {
            "type": "critical",
            "title": "Невозможно включить кондиционер",
            "source": "Кондиционер",
            "time": "18:21, Сегодня",
            "description": "В комнате открыто окно, закройте его и повторите попытку",
            "icon": "ac",
            "size": "m"
        },
        {
            "type": "info",
            "title": "Музыка включена",
            "source": "Яндекс.Станция",
            "time": "18:16, Сегодня",
            "description": "Сейчас проигрывается:",
            "icon": "music",
            "size": "m",
            "data": {
                "albumcover": "https://avatars.yandex.net/get-music-content/193823/1820a43e.a.5517056-1/m1000x1000",
                "artist": "Florence & The Machine",
                "track": {
                    "name": "Big God",
                    "length": "4:31"
                },
                "volume": 80
            }
        },
        {
            "type": "info",
            "title": "Заканчивается молоко",
            "source": "Холодильник",
            "time": "17:23, Сегодня",
            "description": "Кажется, в холодильнике заканчивается молоко. Вы хотите добавить его в список покупок?",
            "icon": "fridge",
            "size": "m",
            "data": {
                "buttons": ["Да", "Нет"]
            }
        },
        {
            "type": "info",
            "title": "Зарядка завершена",
            "source": "Оконный сенсор",
            "time": "16:22, Сегодня",
            "description": "Ура! Устройство «Оконный сенсор» снова в строю!",
            "icon": "battery",
            "size": "s"
        },
        {
            "type": "critical",
            "title": "Пылесос застрял",
            "source": "Сенсор движения",
            "time": "16:17, Сегодня",
            "description": "Робопылесос не смог сменить свое местоположение в течение последних 3 минут. Похоже, ему нужна помощь.",
            "icon": "cam",
            "data": {
                "image": "get_it_from_mocks_:3.jpg"
            },
            "size": "l"
        },
        {
            "type": "info",
            "title": "Вода вскипела",
            "source": "Чайник",
            "time": "16:20, Сегодня",
            "description": null,
            "icon": "kettle",
            "size": "s"
        }
    ]
}

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
    } else {
        const image = document.createElement("img");
        image.classList.add("card__image", "card__image_attachement");
        image.src = './images/Richdata.png';
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

const generateCards = () => {
    data.events.forEach((event) => {
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

generateCards();