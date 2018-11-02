import CardData from "./CardData.js";

export default class CardDataImage extends CardData {

    public static isThisType = (obj: any): obj is CardDataImage => {
        return !!obj && !!obj.image;
    }
    public image: string = "";

    constructor(data: Partial<CardDataImage>) {
        super();
        Object.assign(this, data);
    }
}
