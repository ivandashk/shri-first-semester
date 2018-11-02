import CardData from "./CardData";

export default class CardDataButtons extends CardData {

    public static isThisType = (obj: any): obj is CardDataButtons => {
        return !!obj && !!obj.buttons;
    }
    public buttons: string[] = [""];

    constructor(data: Partial<CardDataButtons>) {
        super();
        Object.assign(this, data);
    }
}
