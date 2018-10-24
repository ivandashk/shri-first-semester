import {
    CardData, 
    CardDataGraph, 
    CardDataButtons, 
    CardDataImage, 
    CardDataMeasurements, 
    CardDataMusic
} from "./card-event-data.js"

export default class CardEvent {
    type: string = '';
    title: string = '';
    source: string = '';
    time: string = '';
    icon: string = '';
    size: string = '';
    description?: string;
    data?: CardData; 

    hasImage: boolean = false;
    isCritical: boolean = false;
    iconTheme: string = '';

    constructor(json: Partial<CardEvent>) {
        Object.assign(this, json);
        this.identifyDataType(json.data);
        this.setModifiers();      
    }

    static fromJSON = (jsonObjects: Array<object>): Array<CardEvent> => {
        const events: Array<CardEvent> = [];
        jsonObjects.forEach(jsonObject => {
            events.push(new CardEvent(jsonObject));
        })
        return events;
    };  

    private identifyDataType(data: CardData | undefined) {
        if(CardDataButtons.isThisType(data)) {
            this.data = new CardDataButtons(data);
        } else if (CardDataImage.isThisType(data)) {
            this.data = new CardDataImage(data);
        } else if (CardDataGraph.isThisType(data)) {
            this.data = new CardDataGraph(data);
        } else if (CardDataMeasurements.isThisType(data)) {
            this.data = new CardDataMeasurements(data);
        } else if (CardDataMusic.isThisType(data)) {
            this.data = new CardDataMusic(data);
        }
    }

    private setModifiers() {
        if (this.data instanceof CardDataImage || this.data instanceof CardDataGraph)
            this.hasImage = true;
        if (this.type === 'critical')
            this.isCritical = true;
        if (this.isCritical)
            this.iconTheme = '-white';
    }
}