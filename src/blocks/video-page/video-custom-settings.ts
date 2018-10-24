class CustomSettings {
    [key: string]: SettingsSet
}

class SettingsSet {
    brightness: number = 100;
    contrast: number = 100;
    audioData: AudioData;

    constructor (video: HTMLVideoElement) {
        this.audioData = new AudioData(video);
    }
}

class AudioData {
    audioCtx: AudioContext;
    analyser: AnalyserNode;
    dataArray: Uint8Array;
    volumePercent: number = 0;

    constructor (video: HTMLVideoElement) {
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