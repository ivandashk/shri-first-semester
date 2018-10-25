class AudioData {
    public audioCtx: AudioContext;
    public analyser: AnalyserNode;
    public dataArray: Uint8Array;
    public volumePercent: number = 0;

    constructor(video: HTMLVideoElement) {
        this.audioCtx = new AudioContext();

        const source = this.audioCtx.createMediaElementSource(video);
        this.analyser = this.audioCtx.createAnalyser();
        source.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);

        this.analyser.smoothingTimeConstant = 0.9;
        this.analyser.fftSize = 32;

        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(this.dataArray);
    }
}
