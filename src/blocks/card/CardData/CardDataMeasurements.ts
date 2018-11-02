import CardData from "./CardData.js";

export default class CardDataMeasurements extends CardData {
    [key: string]: number;

    public static isThisType = (obj: any): obj is CardDataMeasurements => {
        return !!obj && !!obj.temperature && !!obj.humidity;
    }
    public temperature: number = 0;
    public humidity: number = 0;

    constructor(data: Partial<CardDataMeasurements>) {
        super();
        Object.assign(this, data);
    }
}
