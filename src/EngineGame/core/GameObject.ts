import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { GameObjectData, IGameObject } from '../interfaces';

export class GameObject {
    private _scene: THREE.Scene;
    private _selected: boolean = false;
    private _targetable: boolean = false;
    private _label: CSS2DObject;
    private _circle: Line2;
    private _models: any;
    private _gameObjects: any;

    public data: GameObjectData;
    public model: any;
    public uuid: string;
    public obj: any;
    public area: any;

    private _div: HTMLDivElement;
    private _health: number = 1000;
    private _healthBar: HTMLDivElement;
    private _bar: HTMLDivElement;
    private _hit: HTMLDivElement;

    private _dummy = new THREE.Object3D();

    constructor(
        _scene: THREE.Scene,
        _gameObjectData: GameObjectData,
        _model: any,
        _models: any,
        _mixers: THREE.AnimationMixer[],
        _animations: any,
        _gameObjects: IGameObject
    ) {
        this._scene = _scene;
        this._targetable = _gameObjectData.targetable;
        this._models = _models;
        this._gameObjects = _gameObjects;
        this.data = _gameObjectData;
        this.model = _model;

        let instancedMesh = new THREE.InstancedMesh(this.model.geometry, this.model.material, 1);
        instancedMesh.rotation.set(0, this.data.rotation, 0);
        instancedMesh.position.set(this.data.position.y, 0, this.data.position.x);
        instancedMesh.setMatrixAt(0, this._dummy.matrix);
        instancedMesh.name = this.data.name;
        instancedMesh.castShadow = this.data.castShadow;
        this.obj = instancedMesh;
        this.uuid = instancedMesh.uuid;

        if (this.data.name === 'windmill') {
            let i = _models.findIndex((x: any) => x.name === 'windmill2');
            if (i >= 0) {
                const model = _models[i].clone();
                const mixer = new THREE.AnimationMixer(model);
                _mixers.push(mixer);
                this.obj.add(model);

                let a = _animations.findIndex((x: any) => x.name === 'windmillAction');
                if (a >= 0) {
                    const action = mixer.clipAction(_animations[a]);
                    action.play();
                }
            }
        }

        //Create circle area
        const points = [];
        const radius = this.data.width_size > this.data.length_size ? this.data.width_size / 2 : this.data.length_size / 2;
        for (let i = 0; i <= 360; i = i + 15) {
            points.push(Math.sin(i * (Math.PI / 180)) * radius, Math.cos(i * (Math.PI / 180)) * radius, 0);
        }
        const lineGeometry = new LineGeometry();
        lineGeometry.setPositions(points);
        const matLine = new LineMaterial({
            color: 0xffffff,
            linewidth: 0.05,
            dashed: false,
            worldUnits: true
        });
        let line = new Line2(lineGeometry, matLine);
        line.computeLineDistances();
        line.scale.set(1, 1, 1);
        line.rotation.set(Math.PI / 2, 0, 0);
        line.position.set(this.data.width_size > 1 ? this.data.width_size / 2 - 0.5 : 0, 0.04, this.data.length_size > 1 ? this.data.length_size / 2 - 0.5 : 0);
        this._circle = line;

        //Create label text
        this._div = document.createElement('div');
        this._div.className = 'objectDiv';

        const textLabel = document.createElement('div');
        textLabel.className = 'textLabel';
        textLabel.textContent = this.data.label;
        this._div.appendChild(textLabel);

        this._healthBar = document.createElement('div');
        this._healthBar.className = 'health-bar';
        this._healthBar.dataset.dataTotal = this._health.toString();
        this._healthBar.dataset.dataValue = this._health.toString();

        this._bar = document.createElement('div');
        switch (this.data.name) {
            case 'tree1':
                this._bar.className = 'bar-tree';
                break;
            case 'tree2':
                this._bar.className = 'bar-tree';
                break;
            case 'stone1':
                this._bar.className = 'bar-stone';
                break;
            default:
                this._bar.className = 'bar-player-1';
                break;
        }
        this._healthBar.appendChild(this._bar);
        this._hit = document.createElement('div');
        this._hit.className = 'hit';
        this._bar.appendChild(this._hit);

        this._div.appendChild(this._healthBar);
        this._label = new CSS2DObject(this._div);
        this._label.position.set(
            this.data.width_size > 1 ? this.data.width_size / 2 - 0.5 : 0,
            this.data.label_altitude,
            this.data.length_size > 1 ? this.data.length_size / 2 - 0.5 : 0
        );
        this._label.layers.set(0);

        let box = instancedMesh.geometry.boundingBox.clone();
        instancedMesh.updateMatrixWorld(true);
        box.applyMatrix4(instancedMesh.matrix);
        this.area = box;
        this._scene.add(instancedMesh);
    }

    get targetable(): boolean {
        return this._targetable;
    }

    set targetable(_bool: boolean) {
        this._targetable = _bool;
    }

    get selected(): boolean {
        return this._selected;
    }

    set selected(_bool: boolean) {
        if (_bool) {
            this.obj.add(this._label);
            this.obj.add(this._circle);
        } else {
            this.obj.remove(this._label);
            this.obj.remove(this._circle);
        }
        this._selected = _bool;
    }

    get health(): number {
        return this._health;
    }

    set health(newHealth: number) {
        let total = parseInt(this._healthBar.getAttribute('data-data-total')!);
        let value = parseInt(this._healthBar.getAttribute('data-data-value')!);

        let damage = Math.floor(Math.random() * total);
        let newValue = value - damage;

        let barWidth = (newValue / total) * 100;
        let hitWidth = (damage / value) * 100 + '%';

        this._hit.style.width = hitWidth;
        this._healthBar.dataset.dataValue = newValue.toString();

        setTimeout(() => {
            this._hit.style.width = '0';
            this._bar.style.width = barWidth + '%';
        }, 500);
    }

    public updateFence = () => {
        let forward = Object.keys(this._gameObjects).find(
            (key: string) =>
                this._gameObjects[key].data.name.includes('fence') &&
                this._gameObjects[key].data.position.y === this.data.position.y &&
                this._gameObjects[key].data.position.x === this.data.position.x - 1
        );
        let backward = Object.keys(this._gameObjects).find(
            (key: string) =>
                this._gameObjects[key].data.name.includes('fence') &&
                this._gameObjects[key].data.position.y === this.data.position.y &&
                this._gameObjects[key].data.position.x === this.data.position.x + 1
        );
        let left = Object.keys(this._gameObjects).find(
            (key: string) =>
                this._gameObjects[key].data.name.includes('fence') &&
                this._gameObjects[key].data.position.y === this.data.position.y - 1 &&
                this._gameObjects[key].data.position.x === this.data.position.x
        );
        let right = Object.keys(this._gameObjects).find(
            (key: string) =>
                this._gameObjects[key].data.name.includes('fence') &&
                this._gameObjects[key].data.position.y === this.data.position.y + 1 &&
                this._gameObjects[key].data.position.x === this.data.position.x
        );

        if (forward && left && backward && right) {
            this._updateFenceModel('fence2', 0);
        } else if ((forward && left && backward) || (left && backward && right) || (backward && right && forward) || (right && forward && left)) {
            if (forward && left && backward) {
                this._updateFenceModel('fence3', -Math.PI / 2);
            } else if (left && backward && right) {
                this._updateFenceModel('fence3', 0);
            } else if (backward && right && forward) {
                this._updateFenceModel('fence3', Math.PI / 2);
            } else {
                this._updateFenceModel('fence3', -Math.PI);
            }
        } else if ((forward && left) || (left && backward) || (backward && right) || (right && forward)) {
            if (forward && left) {
                this._updateFenceModel('fence4', -Math.PI);
            } else if (left && backward) {
                this._updateFenceModel('fence4', -Math.PI / 2);
            } else if (backward && right) {
                this._updateFenceModel('fence4', 0);
            } else {
                this._updateFenceModel('fence4', Math.PI / 2);
            }
        } else if (forward || backward) {
            this._updateFenceModel('fence1', Math.PI / 2);
        } else {
            this._updateFenceModel('fence1', 0);
        }
    };

    private _updateFenceModel = (_name: string, _rotation: number) => {
        let i = this._models.findIndex((x: any) => x.name === _name);
        if (i <= -1) return;

        let instancedMesh = new THREE.InstancedMesh(this._models[i].geometry, this._models[i].material, 1);
        instancedMesh.rotation.set(0, _rotation, 0);
        instancedMesh.position.set(this.data.position.y, 0, this.data.position.x);
        instancedMesh.setMatrixAt(0, this._dummy.matrix);
        instancedMesh.name = this.data.name;
        instancedMesh.castShadow = this.data.castShadow;
        this._scene.remove(this.obj);
        this.obj = instancedMesh;
        this.uuid = instancedMesh.uuid;
        this._scene.add(this.obj);
    };
}
