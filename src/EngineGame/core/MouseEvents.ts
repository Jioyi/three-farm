import * as THREE from 'three';
import { BasicInputController } from './BasicInputController';
import { GameObject } from './GameObject';
import EngineGame from '..';

export default class MouseEvents {
    private _engine: EngineGame;

    public _rawCoords: THREE.Vector2;
    public _mouseDown: THREE.Vector2 | undefined;

    private _selector!: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
    private _input: BasicInputController;
    private _prevMouse!: THREE.Vector2;
    private _rawMouseDown: THREE.Vector2 | undefined;

    private _frustum!: THREE.Frustum;
    private _position0!: THREE.Vector2;
    private _position1!: THREE.Vector2;

    private _selectorPaused: boolean = false;
    private _gameObjectTarget: GameObject | undefined;
    private _assetTarget: string | undefined;
    private _pointer: THREE.Vector2;
    private _pointer2: THREE.Vector2;
    private _raycaster = new THREE.Raycaster();
    private _targetX: number = 0;
    private _targetY: number = 0;

    private _eventGameHandler: (...args: any[]) => any;

    constructor(_engine: EngineGame, eventGameHandler: (...args: any[]) => any) {
        this._engine = _engine;
        this._eventGameHandler = eventGameHandler;

        this._input = new BasicInputController(this._eventKey.bind(this));
        this._pointer = new THREE.Vector2();
        this._pointer2 = new THREE.Vector2();
        this._raycaster = new THREE.Raycaster();
        this._raycaster.layers.set(2);
        this._rawCoords = new THREE.Vector2();

        this._engine.labelRenderer.domElement.addEventListener('mousemove', this._onMouseMove.bind(this), false);
        this._engine.labelRenderer.domElement.addEventListener('mousedown', this._onMouseDown.bind(this), false);
        this._engine.labelRenderer.domElement.addEventListener('mouseup', this._onMouseUp.bind(this), false);

        this._engine.labelRenderer.domElement.addEventListener('mousedown', this._onMouseDownTest.bind(this), false);

        this._frustum = new THREE.Frustum();

        this._createSelector();
    }

    private _createSelector = () => {
        var selectorMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff
        });
        const points = [];
        points.push(new THREE.Vector3(-1, -1, 0));
        points.push(new THREE.Vector3(-1, 1, 0));
        points.push(new THREE.Vector3(1, 1, 0));
        points.push(new THREE.Vector3(1, -1, 0));
        points.push(new THREE.Vector3(-1, -1, 0));
        let selectorGeometry = new THREE.BufferGeometry().setFromPoints(points);

        this._selector = new THREE.Line(selectorGeometry, selectorMaterial);
        this._selector.layers.set(1);
        this._selector.visible = false;
        this._engine.scene.add(this._selector);
    };

    private _onMouseMove = (_event: any) => {
        if (this._selectorPaused) {
            if (!this._gameObjectTarget) return;
            this._pointer2.x = (_event.clientX / window.innerWidth) * 2 - 1;
            this._pointer2.y = -(_event.clientY / window.innerHeight) * 2 + 1;
            this._raycaster.setFromCamera(this._pointer2, this._engine.camera);

            const intersects = this._raycaster.intersectObjects([this._engine.terrain]);
            if (intersects.length > 0) {
                if (this._targetX === Math.round(intersects[0].point.z) && this._targetY === Math.round(intersects[0].point.x)) return;
                this._targetX = this._gameObjectTarget.mesh.position.z = Math.round(intersects[0].point.z);
                this._targetY = this._gameObjectTarget.mesh.position.x = Math.round(intersects[0].point.x);

                this._gameObjectTarget.data.position.x = this._targetX;
                this._gameObjectTarget.data.position.y = this._targetY;

                if (this._gameObjectTarget.assetData.name === 'fence' || this._gameObjectTarget.assetData.name === 'ditch')
                    this._gameObjectTarget.updateDirection(true);

                let isPossible = true;
                for (let x = this._targetX; x > this._targetX - this._gameObjectTarget.assetData.sizeX; x--) {
                    for (let y = this._targetY; y < this._targetY + this._gameObjectTarget.assetData.sizeY; y++) {
                        if (x < 0 || y < 0 || x >= this._engine.mapSize || x >= this._engine.mapSize) {
                            isPossible = false;
                            continue;
                        }
                        if (!this._engine.terrain.tiles[x][y].empty || !this._engine.terrain.tiles[x][y].sold) isPossible = false;
                    }
                }
                if (this._engine.money < this._gameObjectTarget.assetData.price) isPossible = false;
                if (isPossible) {
                    this._gameObjectTarget.red = true;
                } else {
                    this._gameObjectTarget.red = false;
                }
            }
            return;
        }
        this._updateMouseCoords(_event);
        if (!this._prevMouse.equals(this._pointer)) {
            if (this._mouseDown) {
                const positions = (this._selector.geometry as THREE.BufferGeometry).attributes.position.array as Array<number>;

                positions[3] = this._rawCoords.x;
                positions[6] = this._rawCoords.x;
                positions[7] = this._rawCoords.y;
                positions[10] = this._rawCoords.y;

                (this._selector.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;

                this._position1 = this._pointer.clone();
                this._updateFrustrum();
            }
        }
    };

    private _onMouseDown = (_event: any) => {
        if (this._input.keysPressed.shift || _event.button === 1) {
            this._engine.orbitControls.enablePan = true;
            return;
        }
        if (this._selectorPaused) {
            if (this._gameObjectTarget) {
                let isPossible = true;
                for (let x = this._targetX; x > this._targetX - this._gameObjectTarget.assetData.sizeX; x--) {
                    for (let y = this._targetY; y < this._targetY + this._gameObjectTarget.assetData.sizeY; y++) {
                        if (x < 0 || y < 0 || x >= this._engine.mapSize || x >= this._engine.mapSize) {
                            isPossible = false;
                            continue;
                        }
                        if (!this._engine.terrain.tiles[x][y].empty || !this._engine.terrain.tiles[x][y].sold) isPossible = false;
                    }
                }
                if (this._engine.money < this._gameObjectTarget.assetData.price) isPossible = false;

                if (isPossible) {
                    for (let x = this._targetX; x > this._targetX - this._gameObjectTarget.assetData.sizeX; x--) {
                        for (let y = this._targetY; y < this._targetY + this._gameObjectTarget.assetData.sizeY; y++) {
                            this._engine.terrain.tiles[x][y].empty = false;
                        }
                    }

                    this._gameObjectTarget.mesh.position.z = this._targetX;
                    this._gameObjectTarget.mesh.position.x = this._targetY;

                    this._gameObjectTarget.data.position.x = this._targetX;
                    this._gameObjectTarget.data.position.y = this._targetY;

                    this._gameObjectTarget.updateBox();
                    this._engine.gameObjects[this._gameObjectTarget.uuid] = this._gameObjectTarget;

                    if (this._gameObjectTarget.assetData.name === 'fence' || this._gameObjectTarget.assetData.name === 'ditch')
                        this._gameObjectTarget.updateDirection(true);

                    this._engine.money -= this._gameObjectTarget.assetData.price;
                    if (this._gameObjectTarget.assetData.type === 'storage') {
                        this._engine.storage += this._gameObjectTarget.assetData.sizeX * this._gameObjectTarget.assetData.sizeY;
                    }

                    this._gameObjectTarget = undefined;
                    this.createGameObject(this._assetTarget!);
                } else {
                    this._gameObjectTarget.destroy();
                    this._gameObjectTarget = undefined;
                    this._assetTarget = undefined;
                    this._selectorPaused = false;
                }
            }
            return;
        }
        this._engine.orbitControls.enablePan = false;
        this._updateMouseCoords(_event);
        this._mouseDown = this._pointer.clone();
        this._rawMouseDown = this._rawCoords.clone();

        this._selector.visible = true;
        const positions = (this._selector.geometry as THREE.BufferGeometry).attributes.position.array as Array<number>;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] = this._rawCoords.x;
            positions[i + 1] = this._rawCoords.y;
        }
        (this._selector.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
        this._position0 = this._pointer.clone();
        this._position1 = this._pointer.clone();
        this._updateFrustrum();
    };

    private _onMouseUp = (_event: any) => {
        if (this._selectorPaused) return;
        if (this._input.keysPressed.shift || _event.button === 1) {
            this._engine.orbitControls.enablePan = true;
            return;
        }
        this._engine.orbitControls.enablePan = false;
        this._updateMouseCoords(_event);
        this._mouseDown = undefined;
        this._rawMouseDown = undefined;

        this._selector.visible = false;
        this._selectObjects();
    };

    private _updateMouseCoords = (_event: any) => {
        this._prevMouse = this._pointer.clone();
        this._rawCoords.x = _event.clientX - this._engine.labelRenderer.domElement.offsetLeft - this._engine.labelRenderer.domElement.offsetWidth / 2;
        this._rawCoords.y = -(_event.clientY - this._engine.labelRenderer.domElement.offsetTop + 0.5) + this._engine.labelRenderer.domElement.offsetHeight / 2;
        this._pointer.x =
            ((_event.clientX - this._engine.labelRenderer.domElement.offsetLeft + 0.5) / this._engine.labelRenderer.domElement.offsetWidth) * 2 - 1;
        this._pointer.y =
            -((_event.clientY - this._engine.labelRenderer.domElement.offsetTop + 0.5) / this._engine.labelRenderer.domElement.offsetHeight) * 2 + 1;
    };

    private _updateFrustrum = () => {
        let pos0 = new THREE.Vector3(Math.min(this._position0.x, this._position1.x), Math.min(this._position0.y, this._position1.y));
        let pos1 = new THREE.Vector3(Math.max(this._position0.x, this._position1.x), Math.max(this._position0.y, this._position1.y));

        let cameraDir = new THREE.Vector3();

        this._engine.camera.getWorldDirection(cameraDir);

        let cameraDirInv = cameraDir.clone().negate();
        let cameraNear = this._engine.camera.position.clone().add(cameraDir.clone().multiplyScalar(this._engine.camera.near));
        let cameraFar = this._engine.camera.position.clone().add(cameraDir.clone().multiplyScalar(this._engine.camera.far));

        this._frustum.planes[0].setFromNormalAndCoplanarPoint(cameraDir, cameraNear);
        this._frustum.planes[1].setFromNormalAndCoplanarPoint(cameraDirInv, cameraFar);

        // build frustrum plane on the left
        let rayLeft = new THREE.Ray();
        rayLeft.origin.setFromMatrixPosition(this._engine.camera.matrixWorld);
        rayLeft.direction.set(pos0.x, -0.25, 1).unproject(this._engine.camera).sub(rayLeft.origin).normalize();
        let rayLeftTarget1 = new THREE.Vector3();
        rayLeft.intersectPlane(this._frustum.planes[1], rayLeftTarget1);

        rayLeft.origin.setFromMatrixPosition(this._engine.camera.matrixWorld);
        rayLeft.direction.set(pos0.x, 0.25, 1).unproject(this._engine.camera).sub(rayLeft.origin).normalize();
        let rayLeftTarget2 = new THREE.Vector3();
        rayLeft.intersectPlane(this._frustum.planes[1], rayLeftTarget2);

        this._frustum.planes[2].setFromCoplanarPoints(this._engine.camera.position, rayLeftTarget1, rayLeftTarget2);

        // build frustrum plane on the right
        let rayRight = new THREE.Ray();
        rayRight.origin.setFromMatrixPosition(this._engine.camera.matrixWorld);
        rayRight.direction.set(pos1.x, 0.25, 1).unproject(this._engine.camera).sub(rayRight.origin).normalize();
        let rayRightTarget1 = new THREE.Vector3();
        rayRight.intersectPlane(this._frustum.planes[1], rayRightTarget1);

        rayRight.origin.setFromMatrixPosition(this._engine.camera.matrixWorld);
        rayRight.direction.set(pos1.x, -0.25, 1).unproject(this._engine.camera).sub(rayRight.origin).normalize();
        let rayRightTarget2 = new THREE.Vector3();
        rayRight.intersectPlane(this._frustum.planes[1], rayRightTarget2);

        this._frustum.planes[3].setFromCoplanarPoints(this._engine.camera.position, rayRightTarget1, rayRightTarget2);

        // build frustrum plane on the top
        let rayTop = new THREE.Ray();
        rayTop.origin.setFromMatrixPosition(this._engine.camera.matrixWorld);
        rayTop.direction.set(0.25, pos0.y, 1).unproject(this._engine.camera).sub(rayTop.origin).normalize();
        let rayTopTarget1 = new THREE.Vector3();
        rayTop.intersectPlane(this._frustum.planes[1], rayTopTarget1);

        rayTop.origin.setFromMatrixPosition(this._engine.camera.matrixWorld);
        rayTop.direction.set(-0.25, pos0.y, 1).unproject(this._engine.camera).sub(rayTop.origin).normalize();
        let rayTopTarget2 = new THREE.Vector3();
        rayTop.intersectPlane(this._frustum.planes[1], rayTopTarget2);

        this._frustum.planes[4].setFromCoplanarPoints(this._engine.camera.position, rayTopTarget1, rayTopTarget2);

        // build frustrum plane on the bottom
        let rayBottom = new THREE.Ray();
        rayBottom.origin.setFromMatrixPosition(this._engine.camera.matrixWorld);
        rayBottom.direction.set(-0.25, pos1.y, 1).unproject(this._engine.camera).sub(rayBottom.origin).normalize();
        let rayBottomTarget1 = new THREE.Vector3();
        rayBottom.intersectPlane(this._frustum.planes[1], rayBottomTarget1);

        rayBottom.origin.setFromMatrixPosition(this._engine.camera.matrixWorld);
        rayBottom.direction.set(0.25, pos1.y, 1).unproject(this._engine.camera).sub(rayBottom.origin).normalize();
        let rayBottomTarget2 = new THREE.Vector3();
        rayBottom.intersectPlane(this._frustum.planes[1], rayBottomTarget2);

        this._frustum.planes[5].setFromCoplanarPoints(this._engine.camera.position, rayBottomTarget1, rayBottomTarget2);
    };

    private _selectObjects = () => {
        const list: any[] = [];

        for (let key of Object.keys(this._engine.gameObjects)) {
            if (!this._engine.gameObjects[key].targetable) continue;
            if (this._frustum.intersectsBox(this._engine.gameObjects[key].area)) {
                this._engine.gameObjects[key].selected = true;
                list.push(this._engine.gameObjects[key].data);
            } else {
                this._engine.gameObjects[key].selected = false;
            }
        }
    };

    private _eventKey(_data: any) {
        if (_data.event === 'keydown' && _data.key === 'Escape') {
            if (this._gameObjectTarget) {
                this._gameObjectTarget.destroy();
                this._gameObjectTarget = undefined;
                this._assetTarget = undefined;
                this._selectorPaused = false;
            }
        }
    }

    public createGameObject = (_nameAssets: string) => {
        if (this._gameObjectTarget) this._gameObjectTarget.destroy();

        this._selectorPaused = true;

        let assetIndex = this._engine.gameData.assets.findIndex((asset) => asset.name === _nameAssets);
        if (assetIndex <= -1) return;

        const gameObject = new GameObject(this._engine, {
            object_id: this._engine.gameData.assets[assetIndex].id,
            rotation: 0,
            position: { x: 0, y: 0 }
        });
        gameObject.mesh.position.z = this._targetX;
        gameObject.mesh.position.x = this._targetY;
        this._gameObjectTarget = gameObject;
        this._assetTarget = _nameAssets;
    };

    private _onMouseDownTest = (_event: any) => {
        this._pointer2.x = (_event.clientX / window.innerWidth) * 2 - 1;
        this._pointer2.y = -(_event.clientY / window.innerHeight) * 2 + 1;
        this._raycaster.setFromCamera(this._pointer2, this._engine.camera);
        const intersects = this._raycaster.intersectObjects([this._engine.terrain]);
        if (intersects.length > 0) {
            console.log(Math.round(intersects[0].point.z), Math.round(intersects[0].point.x));
        }
    };
}
