import Pointer from "./Pointer.js";

export default class CurrentGesture {
    public pointers: Pointer[] = [];
    public name: string = "";
    public initialFingerDistance: number | undefined;
    public prevFingerAtan: number | undefined;
    public recognizeMoves: number = 0;
}
