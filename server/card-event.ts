import CardData from "./CardData/CardData";
import CardDataButtons from "./CardData/CardDataButtons";
import CardDataGraph from "./CardData/CardDataGraph";
import CardDataImage from "./CardData/CardDataImage";
import CardDataMeasurements from "./CardData/CardDataMeasurements";
import CardDataMusic from "./CardData/CardDataMusic";

type CardType = "info" | "critical";
type CardSize = "s" | "m" | "l";

export default class CardEvent {
    public static fromJSON = (jsonObjects: object[]): CardEvent[] => {
        const events: CardEvent[] = [];
        jsonObjects.forEach((jsonObject) => {
            events.push(new CardEvent(jsonObject));
        });
        return events;
    }

    public type: CardType = "info";
    public title: string = "";
    public source: string = "";
    public time: string = "";
    public icon: string = "";
    public size: CardSize = "s";
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
