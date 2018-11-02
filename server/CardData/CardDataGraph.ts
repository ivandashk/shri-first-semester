import CardData from "./CardData";

export default class CardDataGraph extends CardData {

    public static isThisType = (obj: any): obj is CardDataGraph => {
        return !!obj && !!obj.type && obj.type === "graph";
    }
    public type: string = "";

    constructor(data: Partial<CardDataGraph>) {
        super();
        Object.assign(this, data);
    }
}
