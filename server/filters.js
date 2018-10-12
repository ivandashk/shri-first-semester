module.exports = {
    filterEventsByType: (responseEvents, typeString) => {
        const types = typeString.split(':');

        const knownTypes = ['info', 'critical'];
        if (!types.every(type => knownTypes.includes(type))) {
            throw new Error('incorrect type');
        } 

        return responseEvents.filter(event => types.includes(event.type));
    },

    filterEventsByPage: (responseEvents, page, pageSize) => {
        if (!isInteger(page) || (!!pageSize && !isInteger(pageSize))) {
            throw new Error('incorrect type');
        }

        const eventsOnPage = parseInt(pageSize) || 3;
        const initialPageIndex = eventsOnPage * parseInt(page);
        return responseEvents.slice(initialPageIndex, initialPageIndex + eventsOnPage);
    }
}

const isInteger = (value) => {
    return /^\d+$/.test(value);
}