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

const isCritical = (type) => {
    return type === 'critical';
}

const hasAttachedImage = (event) => {
    return !!event.data && (!!event.data.image || (!!event.data.type && event.data.type === 'graph'));
}

const createCard = () => {
    const ribbon = document.getElementById("ribbon");
    const card = document.createElement("div");
    card.classList.add("card");
    ribbon.appendChild(card);
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
    const header = document.createElement("div");
    header.classList.add("card__row");
    card.appendChild(header);

    const icon = document.createElement("img");
    icon.classList.add("card__image", "card__image_icon");
    let iconName = event.icon;
    if (event.type === 'critical') {
        iconName += '-white';
    }
    icon.src = `./images/${iconName}.svg`;
    header.appendChild(icon);

    const title = document.createElement("div");
    title.innerHTML = event.title;
    title.classList.add("card__title");
    header.appendChild(title);
}

const setBasicInfo = (event, card) => {
    if (event.size === 's') {
        setColumnBasicInfo(event, card);
    } else {
        setRowBasicInfo(event, card);
    }
}

const setColumnBasicInfo = (event, card) => {
    const device = document.createElement("div");
    device.classList.add("card__basic-info");
    device.innerHTML = event.source;
    card.appendChild(device);

    const time = document.createElement("div");
    time.classList.add("card__basic-info");
    time.innerHTML = event.time;
    card.appendChild(time);
}

const setRowBasicInfo = (event, card) => {
    const basicInfo = document.createElement("div");
    basicInfo.classList.add("card__basic-info");
    if (isCritical(event.type)) {
        basicInfo.classList.add("card__basic-info_with-bottom-margin");
    }
    card.appendChild(basicInfo);

    const device = document.createElement("div");
    device.classList.add("card__device");
    device.innerHTML = event.source;
    basicInfo.appendChild(device);

    const time = document.createElement("div");
    time.classList.add("card__time");
    time.innerHTML = event.time;
    basicInfo.appendChild(time);
}

const appendCriticalDetails = (card) => {
    const details = document.createElement("div");
    details.classList.add("card__details");
    card.appendChild(details);
    return details;
}

const appendDescription = (event, card) => {
    if (!event.description) return;

    const description = document.createElement("div");
    if (event.size === 'l') {
        description.classList.add("card__description_l");
    }
    if (!isCritical(event.type)) {
        description.classList.add("card__description");
    }
    description.innerHTML = event.description;
    card.appendChild(description);
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

    const container = document.createElement("div");
    container.classList.add("card__image-container");
    card.appendChild(container);

    const image = document.createElement("img");
    image.classList.add("card__image", "card__image_attachement");
    if (event.data.type === 'graph') {
        image.src = './images/Richdata.png';
    } else {
        image.src = './images/bitmap.png';
    }
    container.appendChild(image);
}

const appendButtons = (event, card) => {
    if (!event.data || !event.data.buttons) return;

    const buttonRow = document.createElement("div");
    buttonRow.classList.add("card__row");
    card.appendChild(buttonRow);

    event.data.buttons.forEach(function(buttonText, i) {
        const button = document.createElement("div");
        button.classList.add("card__button");
        if (i === 0) {
            button.classList.add("card__button_accent");
        }
        button.innerHTML = buttonText;
        buttonRow.appendChild(button);
    });
}

const appendMeasurements = (event, card) => {
    if (!event.data || !event.data.temperature || !event.data.humidity) return;

    const measurements = document.createElement("div");
    measurements.classList.add("card__measurements");
    card.appendChild(measurements);

    let measurementData = [];
    if (!!event.data.temperature) {
        measurementData.push(['temperature', 'Температура:&nbsp;', ' C']);
    }
    if (!!event.data.humidity) {
        measurementData.push(['humidity', 'Влажность:&nbsp;', '%']);
    }

    measurementData.forEach(function(data) {
        const measurement = document.getElementById('measurement');
        measurement.content.querySelector('.measurement__text').innerHTML = data[1];
        measurement.content.querySelector('.measurement__value').innerHTML = event.data[data[0]] + data[2];
        const clone = document.importNode(measurement.content, true);
        measurements.appendChild(clone);
    });
}

const markLastElementInCard = (card) => {
    if (card.lastElementChild.classList.length === 0) return;
    card.lastElementChild.classList.add("card__last-element");
}

data.events.forEach(function(event) {
    let card = createCard();
    setSize(event, card);
    setType(event, card);
    setCardHeader(event, card);
    setBasicInfo(event, card);

    if (isCritical(event.type)) {
        card = appendCriticalDetails(card);
    }

    appendDescription(event, card);
    appendPlayer(event, card);
    appendAttachedImage(event, card);
    appendButtons(event, card);
    appendMeasurements(event, card);

    markLastElementInCard(card);
});
