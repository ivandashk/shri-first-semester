import express from "express";
import fs from "fs";
import path from "path";
import url from "url";
import CardEvent from "./card-event";
import { filterEventsByPage, filterEventsByType } from "./filters";
import log from "./logger";

const app = express();
const port = 8000;

const publicFolder = "docs";
const lastVisitedPagePath = "./server/lastVisitedPage.txt";
let lastVisitedPage: string;

const launchTime = Date.now();
const minutesInHour = 60;

app.use(express.json());

app.get("/", (req, res) => {
    if (!lastVisitedPage) {
        fs.readFile(lastVisitedPagePath, {encoding: "utf-8"}, (err, data) => {
            if (err) {
                res.status(500).json({ error: err.message }).send();
                log(req, res.statusCode.toString(), err.message);
                return;
            }

            lastVisitedPage = data;
            res.status(200).sendFile(path.join(__dirname, "..", publicFolder, lastVisitedPage));
        });
    } else {
        res.status(200).sendFile(path.join(__dirname, "..", publicFolder, lastVisitedPage));
    }
});

app.use(express.static(publicFolder));

app.get("/getPage", (req, res) => {
    res.send({ lastVisited: lastVisitedPage });
    log(req, res.statusCode.toString());
});

app.post("/savePage", (req, res) => {
    const newPageValue = req.body.pageName;
    fs.writeFile(lastVisitedPagePath, newPageValue, (err) => {
        if (err) {
            res.status(500).json({ error: err.message }).send();
            log(req, res.statusCode.toString(), err.message);
            return;
        }

        lastVisitedPage = newPageValue;
        res.status(200);
        log(req, res.statusCode.toString());
    });
});

app.get("/status", (req, res) => {
    const timeDelta = new Date((Date.now() - launchTime));
    const currentTimeZoneOffsetInHours = timeDelta.getTimezoneOffset() / minutesInHour;

    const hoursDelta = timeDelta.getHours() + currentTimeZoneOffsetInHours;
    const minutesDelta = timeDelta.getMinutes();
    const secondsDelta = timeDelta.getSeconds();

    res.status(200).send(`${hoursDelta}:${minutesDelta}:${secondsDelta}`);
    log(req, res.statusCode.toString());
});

app.post("/api/events", (req, res) => {
    const params = url.parse(req.url, true).query;
    const paramsCount = Object.getOwnPropertyNames(params);
    const events = require("./events");

    if (paramsCount.length === 0) {
        res.send(events);
        log(req, res.statusCode.toString());
        return;
    }

    let responseEvents: CardEvent[] = CardEvent.fromJSON(events.events);
    Object.assign(responseEvents, events.events);

    try {
        if (params.type) {
            responseEvents = filterEventsByType(responseEvents, params.toString());
        }
        if (params.page) {
            responseEvents = filterEventsByPage(responseEvents, params.page.toString(), params.pageSize.toString());
        }
    } catch (err) {
        res.status(400).json({ error: err.message }).send();
        log(req, res.statusCode.toString(), err.message);
        return;
    }

    res.send({ events: responseEvents });
    log(req, res.statusCode.toString());
});

app.get("*", (req, res) => {
    res.status(404);
    const message = "Page not found";
    res.send(`<h1>${message}</h1>`);
    log(req, res.statusCode.toString(), message);
});

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`App listening at http://localhost:${port}`);
});
