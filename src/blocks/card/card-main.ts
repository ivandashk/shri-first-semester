import CardEvent from "./card-event.js";
import generateCards from "./card-generator.js";
import data from "./events.js";

const events = CardEvent.fromJSON(data.events);
generateCards(events);
