module.exports = {
    filterEventsByType: (responseEvents, typeString) => {
        const types = typeString.split(':');

        if (!types.every(type => type === 'info' || type === 'critical')) {
            throw new Error('incorrect type');
        } 

        return responseEvents.filter(event => types.includes(event.type));
    },

    filterEventsByPage: (responseEvents, page) => {
        if (!/^\d+$/.test(page)) {
            throw new Error('incorrect type');
        }

        const eventsOnPage = 3;
        const initialPageIndex = eventsOnPage * page;
        return responseEvents.slice(initialPageIndex, initialPageIndex + eventsOnPage);
    }
}