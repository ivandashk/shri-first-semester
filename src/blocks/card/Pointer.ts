export default class Pointer {
    public pointerId: number;
    public startX: number;
    public startY: number;

    constructor(pointerId: number, startX: number, startY: number) {
        this.pointerId = pointerId;
        this.startX = startX;
        this.startY = startY;
    }
}
