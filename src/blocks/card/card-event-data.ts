abstract class CardData {
}

class CardDataGraph extends CardData {
    type: string;

    constructor(data: Partial<CardDataGraph>) {
        super();
        this.type = data.type as string;
    }

    static isThisType = (obj: any): obj is CardDataGraph => {
        return !!obj && !!obj.type && obj.type === 'graph';
    }
}

class CardDataButtons extends CardData {
    buttons: Array<string>;

    constructor(data: Partial<CardDataButtons>) {
        super();
        this.buttons = data.buttons as Array<string>;
    }

    static isThisType = (obj: any): obj is CardDataButtons => {
        return !!obj && !!obj.buttons;
    }
}

class CardDataImage extends CardData {
    image: string;

    constructor(data: Partial<CardDataImage>) {
        super();
        this.image = data.image as string;
    }

    static isThisType = (obj: any): obj is CardDataImage => {
        return !!obj && !!obj.image;
    }
}

class CardDataMeasurements extends CardData {
    temperature: number;
    humidity: number;
    [key:string]: number;

    constructor(data: Partial<CardDataMeasurements>) {
        super();
        this.temperature = data.temperature as number;
        this.humidity = data.humidity as number;
    }

    static isThisType = (obj: any): obj is CardDataMeasurements => {
        return !!obj && !!obj.temperature && !!obj.humidity;
    }
}

class CardDataMusic extends CardData {
    albumcover: string;
    artist: string;
    track: MusicTrack;
    volume: number;

    constructor(data: Partial<CardDataMusic>) {
        super();
        this.albumcover = data.albumcover as string;
        this.artist = data.artist as string;
        this.track = data.track as MusicTrack;
        this.volume = data.volume as number;
    }

    static isThisType = (obj: any): obj is CardDataMusic => {
        return !!obj && !!obj.albumcover && !!obj.artist && !!obj.track && !!obj.volume;
    }
}

interface MusicTrack {
    name: string;
    length: number;
}

export { CardData, CardDataGraph, CardDataButtons, CardDataImage, CardDataMeasurements, CardDataMusic };