import CardData from "./CardData.js";

export default class CardDataMusic extends CardData {

    public static isThisType = (obj: any): obj is CardDataMusic => {
        return !!obj && !!obj.albumcover && !!obj.artist && !!obj.track && !!obj.volume;
    }
    public albumcover: string = "";
    public artist: string = "";
    public track: IMusicTrack = { name: "", length: 0};
    public volume: number = 0;

    constructor(data: Partial<CardDataMusic>) {
        super();
        Object.assign(this, data);
    }
}

interface IMusicTrack {
    name: string;
    length: number;
}
