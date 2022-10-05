export class Keys {
    shift: boolean = false;
    escape: boolean = false;
}

export class BasicInputController {
    public keysPressed: Keys;

    private _eventKey: (...args: any[]) => any;

    constructor(_eventKey: (...args: any[]) => any) {
        this.keysPressed = new Keys();
        this._eventKey = _eventKey;
        document.addEventListener('keydown', (_event) => this.OnKeyDown(_event), false);
        document.addEventListener('keyup', (_event) => this.onKeyUp(_event), false);
    }

    OnKeyDown(_event: KeyboardEvent) {
        switch (_event.key) {
            case 'Shift': // SHIFT
                this.keysPressed.shift = true;
                break;
            case 'Escape': // ESCAPE
                this.keysPressed.escape = false;
                break;
        }
        this._eventKey({ event: 'keydown', key: _event.key });
    }

    onKeyUp(_event: KeyboardEvent) {
        switch (_event.key) {
            case 'Shift': // SHIFT
                this.keysPressed.shift = false;
                break;
            case 'Escape': // ESCAPE
                this.keysPressed.escape = false;
                break;
        }
        this._eventKey({ event: 'keyup', key: _event.key });
    }
}
