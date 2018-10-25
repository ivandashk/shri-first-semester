import CardData from "./CardData/CardData.js";
import CardDataButtons from "./CardData/CardDataButtons.js";
import CardDataGraph from "./CardData/CardDataGraph.js";
import CardDataImage from "./CardData/CardDataImage.js";
import CardDataMeasurements from "./CardData/CardDataMeasurements.js";
import CardDataMusic from "./CardData/CardDataMusic.js";

export default class CardEvent {
    public static fromJSON = (jsonObjects: object[]): CardEvent[] => {
        const events: CardEvent[] = [];
        jsonObjects.forEach((jsonObject) => {
            events.push(new CardEvent(jsonObject));
        });
        return events;
    }

    public type: string = "";
    public title: string = "";
    public source: string = "";
    public time: string = "";
    public icon: string = "";
    public size: string = "";
    public description?: string;
    public data?: CardData;

    public hasImage: boolean = false;
    public isCritical: boolean = false;
    public iconTheme: string = "";

    constructor(json: Partial<CardEvent>) {
        Object.assign(this, json);
        this.identifyDataType(json.data);
        this.setModifiers();
    }

    private identifyDataType(data: CardData | undefined) {
        if (CardDataButtons.isThisType(data)) {
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
        if (this.data instanceof CardDataImage || this.data instanceof CardDataGraph) {
            this.hasImage = true;
        }
        if (this.type === "critical") {
            this.isCritical = true;
        }
        if (this.isCritical) {
            this.iconTheme = "-white";
        }
    }
}
