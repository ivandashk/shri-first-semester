const url = require("url");

module.exports = {
    log: (request: Request, statusCode: string, message: string) => {
        const method = request.method;
        const path = url.parse(request.url, true).path;
        let logMessage = `${method} ${path} - ${statusCode}`;
        if (!!message) {
            logMessage += `: ${message}`;
        }
        // tslint:disable-next-line:no-console
        console.log(logMessage);
    },
};
