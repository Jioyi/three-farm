import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BasicControllerInput } from './BasicControllerInput';
import { IGameObject } from './GameObject';

export default class RayMouse {
    public _rawCoords: THREE.Vector2;
    public _mouseDown: THREE.Vector2 | undefined;

    private _renderer: CSS2DRenderer;
    private _scene: THREE.Scene;
    private _camera: THREE.PerspectiveCamera;
    private _controls: OrbitControls;
    private _mouse: THREE.Vector2;

    private _gameObjects: IGameObject;
    private _frustum!: THREE.Frustum;
    private _position0!: THREE.Vector2;
    private _position1!: THREE.Vector2;

    private _input: BasicControllerInput;
    private _prevMouse!: THREE.Vector2;
    private _rawMouseDown: THREE.Vector2 | undefined;
    private _line: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
    private _eventGameHandler: (...args: any[]) => any;

    constructor(
        _gameObjects: IGameObject,
        _renderer: CSS2DRenderer,
        _scene: THREE.Scene,
        _camera: THREE.PerspectiveCamera,
        _controls: OrbitControls,
        eventGameHandler: (...args: any[]) => any
    ) {
        this._gameObjects = _gameObjects;
        this._renderer = _renderer;
        this._scene = _scene;
        this._camera = _camera;
        this._controls = _controls;
        this._eventGameHandler = eventGameHandler;

        this._input = new BasicControllerInput();
        this._mouse = new THREE.Vector2();
        this._rawCoords = new THREE.Vector2();

        this._renderer.domElement.addEventListener('mousemove', this._onMouseMove.bind(this), false);
        this._renderer.domElement.addEventListener('mousedown', this._onMouseDown.bind(this), false);
        this._renderer.domElement.addEventListener('mouseup', this._onMouseUp.bind(this), false);

        this._frustum = new THREE.Frustum();

        var material = new THREE.LineBasicMaterial({
            color: 0xffffff
        });
        const points = [];
        points.push(new THREE.Vector3(-1, -1, 0));
        points.push(new THREE.Vector3(-1, 1, 0));
        points.push(new THREE.Vector3(1, 1, 0));
        points.push(new THREE.Vector3(1, -1, 0));
        points.push(new THREE.Vector3(-1, -1, 0));
        let geometry = new THREE.BufferGeometry().setFromPoints(points);

        this._line = new THREE.Line(geometry, material);
        this._line.layers.set(1);
        this._line.visible = false;
        this._scene.add(this._line);
    }

    private _onMouseMove = (_event: any) => {
        this._prevMouse = this._mouse.clone();
        this._updateMouseCoords(_event);
        if (!this._prevMouse.equals(this._mouse)) {
            if (this._mouseDown) {
                const positions = (this._line.geometry as THREE.BufferGeometry).attributes.position.array as Array<number>;

                positions[3] = this._rawCoords.x;
                positions[6] = this._rawCoords.x;
                positions[7] = this._rawCoords.y;
                positions[10] = this._rawCoords.y;

                (this._line.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;

                this._position1 = this._mouse.clone();
                this._updateFrustrum();
                //this._selectObjects();
            }
        }
    };

    private _onMouseDown = (_event: any) => {
        if (this._input.keysPressed.shift || _event.button === 1) {
            this._controls.enablePan = true;
            return;
        }
        this._controls.enablePan = false;
        this._prevMouse = this._mouse.clone();
        this._updateMouseCoords(_event);
        this._mouseDown = this._mouse.clone();
        this._rawMouseDown = this._rawCoords.clone();

        this._line.visible = true;
        const positions = (this._line.geometry as THREE.BufferGeometry).attributes.position.array as Array<number>;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] = this._rawCoords.x;
            positions[i + 1] = this._rawCoords.y;
        }
        (this._line.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
        this._position0 = this._mouse.clone();
        this._position1 = this._mouse.clone();
        this._updateFrustrum();
    };

    private _onMouseUp = (_event: any) => {
        if (this._input.keysPressed.shift || _event.button === 1) {
            this._controls.enablePan = true;
            return;
        }
        this._controls.enablePan = false;
        this._prevMouse = this._mouse.clone();
        this._updateMouseCoords(_event);
        this._mouseDown = undefined;
        this._rawMouseDown = undefined;

        this._line.visible = false;
        this._selectObjects();
    };

    private _updateMouseCoords = (_event: any) => {
        this._rawCoords.x = _event.clientX - this._renderer.domElement.offsetLeft - this._renderer.domElement.offsetWidth / 2;
        this._rawCoords.y = -(_event.clientY - this._renderer.domElement.offsetTop + 0.5) + this._renderer.domElement.offsetHeight / 2;
        this._mouse.x = ((_event.clientX - this._renderer.domElement.offsetLeft + 0.5) / this._renderer.domElement.offsetWidth) * 2 - 1;
        this._mouse.y = -((_event.clientY - this._renderer.domElement.offsetTop + 0.5) / this._renderer.domElement.offsetHeight) * 2 + 1;
    };

    private _updateFrustrum = () => {
        let pos0 = new THREE.Vector3(Math.min(this._position0.x, this._position1.x), Math.min(this._position0.y, this._position1.y));
        let pos1 = new THREE.Vector3(Math.max(this._position0.x, this._position1.x), Math.max(this._position0.y, this._position1.y));

        let cameraDir = new THREE.Vector3();

        this._camera.getWorldDirection(cameraDir);

        let cameraDirInv = cameraDir.clone().negate();
        let cameraNear = this._camera.position.clone().add(cameraDir.clone().multiplyScalar(this._camera.near));
        let cameraFar = this._camera.position.clone().add(cameraDir.clone().multiplyScalar(this._camera.far));

        this._frustum.planes[0].setFromNormalAndCoplanarPoint(cameraDir, cameraNear);
        this._frustum.planes[1].setFromNormalAndCoplanarPoint(cameraDirInv, cameraFar);

        if (true) {
            let ray = new THREE.Ray();
            ray.origin.setFromMatrixPosition(this._camera.matrixWorld);
            ray.direction.set(pos0.x, -0.25, 1).unproject(this._camera).sub(ray.origin).normalize();
            let far1 = new THREE.Vector3();
            ray.intersectPlane(this._frustum.planes[1], far1);

            ray.origin.setFromMatrixPosition(this._camera.matrixWorld);
            ray.direction.set(pos0.x, 0.25, 1).unproject(this._camera).sub(ray.origin).normalize();
            let far2 = new THREE.Vector3();
            ray.intersectPlane(this._frustum.planes[1], far2);

            this._frustum.planes[2].setFromCoplanarPoints(this._camera.position, far1, far2);
        }

        // build frustrum plane on the right
        if (true) {
            let ray = new THREE.Ray();
            ray.origin.setFromMatrixPosition(this._camera.matrixWorld);
            ray.direction.set(pos1.x, 0.25, 1).unproject(this._camera).sub(ray.origin).normalize();
            let far1 = new THREE.Vector3();
            ray.intersectPlane(this._frustum.planes[1], far1);

            ray.origin.setFromMatrixPosition(this._camera.matrixWorld);
            ray.direction.set(pos1.x, -0.25, 1).unproject(this._camera).sub(ray.origin).normalize();
            let far2 = new THREE.Vector3();
            ray.intersectPlane(this._frustum.planes[1], far2);

            this._frustum.planes[3].setFromCoplanarPoints(this._camera.position, far1, far2);
        }

        // build frustrum plane on the top
        if (true) {
            let ray = new THREE.Ray();
            ray.origin.setFromMatrixPosition(this._camera.matrixWorld);
            ray.direction.set(0.25, pos0.y, 1).unproject(this._camera).sub(ray.origin).normalize();
            let far1 = new THREE.Vector3();
            ray.intersectPlane(this._frustum.planes[1], far1);

            ray.origin.setFromMatrixPosition(this._camera.matrixWorld);
            ray.direction.set(-0.25, pos0.y, 1).unproject(this._camera).sub(ray.origin).normalize();
            let far2 = new THREE.Vector3();
            ray.intersectPlane(this._frustum.planes[1], far2);

            this._frustum.planes[4].setFromCoplanarPoints(this._camera.position, far1, far2);
        }

        // build frustrum plane on the bottom
        if (true) {
            let ray = new THREE.Ray();
            ray.origin.setFromMatrixPosition(this._camera.matrixWorld);
            ray.direction.set(-0.25, pos1.y, 1).unproject(this._camera).sub(ray.origin).normalize();
            let far1 = new THREE.Vector3();
            ray.intersectPlane(this._frustum.planes[1], far1);

            ray.origin.setFromMatrixPosition(this._camera.matrixWorld);
            ray.direction.set(0.25, pos1.y, 1).unproject(this._camera).sub(ray.origin).normalize();
            let far2 = new THREE.Vector3();
            ray.intersectPlane(this._frustum.planes[1], far2);

            this._frustum.planes[5].setFromCoplanarPoints(this._camera.position, far1, far2);
        }
    };

    /*private _onClick(event: any) {
        this._pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this._raycaster.setFromCamera(this._pointer, this._camera);
        const intersects = this._raycaster.intersectObjects(this._scene.children);
        if (intersects.length > 0) {
            const selected = intersects[0].object;
            console.log(selected.name);
        }
    }*/

    private _selectObjects = () => {
        const list: any[] = [];

        for (let key of Object.keys(this._gameObjects)) {
            if (this._frustum.intersectsBox(this._gameObjects[key].area)) {
                this._gameObjects[key].selected = true;
                list.push(this._gameObjects[key].data);
            } else {
                this._gameObjects[key].selected = false;
            }
        }

        this._eventGameHandler({ type: 'updateObjectsSelected', data: list });
    };
}
