export class CurrentGesture {
    pointers: Array<Pointer> = [];
    name: string = '';
    initialFingerDistance: number | undefined;
    prevFingerAtan: number | undefined;
    recognizeMoves: number = 0;
}

export class Pointer {
    pointerId: number;
    startX: number;
    startY: number;

    constructor(pointerId: number, startX: number, startY: number){
        this.pointerId = pointerId;
        this.startX = startX;
        this.startY = startY;
    }
}