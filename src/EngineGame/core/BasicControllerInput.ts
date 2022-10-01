export class Keys {
    shift: boolean = false;
}

export class BasicControllerInput {
    public keysPressed: Keys;

    constructor() {
        this.keysPressed = new Keys();
        document.addEventListener('keydown', (_event) => this.OnKeyDown(_event), false);
        document.addEventListener('keyup', (_event) => this.onKeyUp(_event), false);
    }

    OnKeyDown(_event: KeyboardEvent) {
        switch (_event.key) {
            case 'Shift': // SHIFT
                this.keysPressed.shift = true;
                break;
        }
    }

    onKeyUp(_event: KeyboardEvent) {
        switch (_event.key) {
            case 'Shift': // SHIFT
                this.keysPressed.shift = false;
                break;
        }
    }
}
