const url = require('url');

module.exports = {
    log: (request, statusCode, message) => {
        const method = request.method;
        const path = url.parse(request.url, true).path;
        let logMessage = `${method} ${path} - ${statusCode}`;
        if (!!message) {
            logMessage += `: ${message}`
        }
        console.log(logMessage);
    }
}