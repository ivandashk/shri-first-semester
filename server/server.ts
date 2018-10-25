import express from "express";
import path from "path";
import url from "url";
import CardEvent from "./card-event";

const { filterEventsByType, filterEventsByPage } = require("./filters");
const { log } = require("./logger");

const app = express();
const port = 8000;

const publicFolder = "docs";

const launchTime = Date.now();
const minutesInHour = 60;

app.use(express.static(publicFolder));

app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, publicFolder, "index.html"));
});

app.get("/status", (req, res) => {
    const timeDelta = new Date((Date.now() - launchTime));
    const currentTimeZoneOffsetInHours = timeDelta.getTimezoneOffset() / minutesInHour;

    const hoursDelta = timeDelta.getHours() + currentTimeZoneOffsetInHours;
    const minutesDelta = timeDelta.getMinutes();
    const secondsDelta = timeDelta.getSeconds();

    res.status(200).send(`${hoursDelta}:${minutesDelta}:${secondsDelta}`);
    log(req, res.statusCode);
});

app.post("/api/events", (req, res) => {
    const params = url.parse(req.url, true).query;
    const paramsCount = Object.getOwnPropertyNames(params);
    const events = require("./events");

    if (paramsCount.length === 0) {
        res.send(events);
        log(req, res.statusCode);
        return;
    }

    let responseEvents: CardEvent[] = CardEvent.fromJSON(events.events);
    Object.assign(responseEvents, events.events);

    try {
        if (params.type) {
            responseEvents = filterEventsByType(responseEvents, params.type);
        }
        if (params.page) {
            responseEvents = filterEventsByPage(responseEvents, params.page, params.pageSize);
        }
    } catch (err) {
        res.status(400).json({ error: err.message }).send();
        log(req, res.statusCode, err.message);
        return;
    }

    res.send({ events: responseEvents });
    log(req, res.statusCode);
});

app.get("*", (req, res) => {
    res.status(404);
    const message = "Page not found";
    res.send(`<h1>${message}</h1>`);
    log(req, res.statusCode, message);
});

app.listen(port);
