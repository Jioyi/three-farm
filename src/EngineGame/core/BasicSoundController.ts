import { Howl } from 'howler';

export class BasicSoundController {
    private _loaded: boolean = false;
    private _sound!: Howl;

    private _currentBackgroundMusic!: number;

    constructor() {
        this._sound = new Howl({
            src: ['assets/sounds/soundtrack.mp3'],
            sprite: {
                backgroundMusic1: [0, 60000, true],
                backgroundMusic2: [60000, 90000, true]
            },
            onload: () => {
                this._loaded = true;
                this._currentBackgroundMusic = this._sound.play('backgroundMusic1');
            }
        });
    }

    public playBackgroundMusic = (_nameSprite: string) => {
        if (this._currentBackgroundMusic) this._sound.stop(this._currentBackgroundMusic);
        this._currentBackgroundMusic = this._sound.play(_nameSprite);
    };

    public changeVolume = (_volume: number) => {
        this._sound.volume(_volume / 100);
    };
}
