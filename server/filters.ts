import CardEvent from "./card-event";

const filterEventsByType = (responseEvents: CardEvent[], typeString: string): CardEvent[] => {
    const types = typeString.split(":");

    const knownTypes = ["info", "critical"];
    if (!types.every((type) => knownTypes.includes(type))) {
        throw new Error("incorrect type");
    }

    return responseEvents.filter((event) => types.includes(event.type));
};

const filterEventsByPage = (responseEvents: CardEvent[], page: string, pageSize: string): CardEvent[] => {
    if (!isInteger(page) || (!!pageSize && !isInteger(pageSize))) {
        throw new Error("incorrect type");
    }

    const eventsOnPage = parseInt(pageSize, 10) || 3;
    const initialPageIndex = eventsOnPage * parseInt(page, 10);
    return responseEvents.slice(initialPageIndex, initialPageIndex + eventsOnPage);
};

const isInteger = (value: string): boolean => {
    return /^\d+$/.test(value);
};

export {
    filterEventsByType,
    filterEventsByPage,
};
