abstract class CardData {
}

class CardDataGraph extends CardData {
    type: string = '';

    constructor(data: Partial<CardDataGraph>) {
        super();
        Object.assign(this, data);
    }

    static isThisType = (obj: any): obj is CardDataGraph => {
        return !!obj && !!obj.type && obj.type === 'graph';
    }
}

class CardDataButtons extends CardData {
    buttons: Array<string> = [''];

    constructor(data: Partial<CardDataButtons>) {
        super();
        Object.assign(this, data);
    }

    static isThisType = (obj: any): obj is CardDataButtons => {
        return !!obj && !!obj.buttons;
    }
}

class CardDataImage extends CardData {
    image: string = '';

    constructor(data: Partial<CardDataImage>) {
        super();
        Object.assign(this, data);
    }

    static isThisType = (obj: any): obj is CardDataImage => {
        return !!obj && !!obj.image;
    }
}

class CardDataMeasurements extends CardData {
    temperature: number = 0;
    humidity: number = 0;
    [key:string]: number;

    constructor(data: Partial<CardDataMeasurements>) {
        super();
        Object.assign(this, data);
    }

    static isThisType = (obj: any): obj is CardDataMeasurements => {
        return !!obj && !!obj.temperature && !!obj.humidity;
    }
}

class CardDataMusic extends CardData {
    albumcover: string = '';
    artist: string = '';
    track: MusicTrack = { name: '', length: 0};
    volume: number = 0;

    constructor(data: Partial<CardDataMusic>) {
        super();
        Object.assign(this, data);
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