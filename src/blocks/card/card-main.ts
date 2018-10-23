import data from "./events.js"
import CardEvent from "./card-event.js"
import generateCards from "./card-generator.js"

const events = CardEvent.fromJSON(data.events);
generateCards(events);