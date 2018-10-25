class SettingsSet {
    public brightness: number = 100;
    public contrast: number = 100;
    public audioData: AudioData;

    constructor(video: HTMLVideoElement) {
        this.audioData = new AudioData(video);
    }
}
