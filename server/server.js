const express = require('express'); 
const url = require('url');
const events = require('./events'); 
const {filterEventsByType, filterEventsByPage} = require('./filters');
const app = express(); 
const port = 8000; 

const publicFolder = "docs";

const launchTime = Date.now();
const minutesInHour = 60;

app.use(express.static(publicFolder));

app.get('/', function(req, res){    
	res.status(200).sendFile(path.join(__dirname, publicFolder, 'index.html'));
});

app.get('/status', function(req, res){
    const timeDelta = new Date((Date.now() - launchTime));
    const currentTimeZoneOffsetInHours = timeDelta.getTimezoneOffset() / minutesInHour;

    const hoursDelta = timeDelta.getHours() + currentTimeZoneOffsetInHours;
    const minutesDelta = timeDelta.getMinutes();
    const secondsDelta = timeDelta.getSeconds();

	res.status(200).send(`${hoursDelta}:${minutesDelta}:${secondsDelta}`);
});

app.post('/api/events', function(req, res){
    const params = url.parse(req.url, true).query;
    if (!params) {
        res.send(events);
        return;
    }

    let responseEvents = [];
    Object.assign(responseEvents, events.events);

    try {
        if (params.type)
            responseEvents = filterEventsByType(responseEvents, params.type);
        if (params.page)
            responseEvents = filterEventsByPage(responseEvents, params.page);
    } catch (err) {
        res.status(400).json({ error: err.message }).send();
        return;
    }
    
    res.send({ "events": responseEvents });
});

app.get('*', function(req, res){
    res.status(404);
    res.send('<h1>Page not found</h1>');
});

app.listen(port); 