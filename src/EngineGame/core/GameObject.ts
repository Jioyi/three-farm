import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { AssetData, AssetType, GameObjectData } from '../interfaces';
import EngineGame from '..';

export class GameObject {
    private _engine: EngineGame;
    private _selected: boolean = false;
    private _targetable: boolean = false;
    private _red: boolean = false;

    private _label!: CSS2DObject;
    private _circle!: Line2;

    public data: GameObjectData;
    public assetData: AssetData;
    public model: any;

    public uuid: string;
    public mesh: any;
    public subMesh: any;
    public area: any;

    private _div!: HTMLDivElement;
    private _textLabel!: HTMLDivElement;
    private _health: number = 1000;
    private _healthBar!: HTMLDivElement;
    private _bar!: HTMLDivElement;
    private _hit!: HTMLDivElement;

    private _dummy = new THREE.Object3D();
    //private _helper!: THREE.BoxHelper;

    //extra data
    private _days: number = 0;

    constructor(_engine: EngineGame, _gameObjectData: GameObjectData) {
        this._engine = _engine;
        this.data = _gameObjectData;

        let assetIndex = this._engine.gameData.assets.findIndex((asset) => asset.id === _gameObjectData.object_id);
        this.assetData = this._engine.gameData.assets[assetIndex];
        this._targetable = this._engine.gameData.assets[assetIndex].targetable;

        let modelIndex = this._engine.uniqueModels.findIndex((model: any) => model.name === this._engine.gameData.assets[assetIndex].name);
        this.model = this._engine.uniqueModels[modelIndex];

        let instancedMesh = new THREE.InstancedMesh(this.model.geometry, this.model.material, 1);
        if (this.assetData.autoRotate) {
            instancedMesh.rotation.set(0, Math.random() * Math.PI, 0);
        } else {
            instancedMesh.rotation.set(0, this.data.rotation, 0);
        }
        instancedMesh.position.set(this.data.position.y, 0, this.data.position.x);
        instancedMesh.setMatrixAt(0, this._dummy.matrix);
        instancedMesh.name = this.assetData.name;
        instancedMesh.castShadow = this.assetData.castShadow;
        this.data.uuid = this.uuid = this.data.uuid ? this.data.uuid : uuidv4();

        this.mesh = instancedMesh;
        this.mesh.updateMatrixWorld(true);

        if (this.assetData.meshAnimation) {
            this._addMeshAnimation(this.assetData.meshAnimation.modelName, this.assetData.meshAnimation.actionName);
        }

        if (this.assetData.targetable) {
            const points = [];
            const radius = this.assetData.sizeX > this.assetData.sizeY ? this.assetData.sizeX / 2 : this.assetData.sizeY / 2;
            for (let i = 0; i <= 360; i = i + 15) {
                points.push(Math.sin(i * (Math.PI / 180)) * radius, Math.cos(i * (Math.PI / 180)) * radius, 0);
            }
            const lineGeometry = new LineGeometry();
            lineGeometry.setPositions(points);

            let line = new Line2(lineGeometry, this._engine.materialLine);
            line.computeLineDistances();
            line.scale.set(1, 1, 1);
            line.rotation.set(Math.PI / 2, 0, 0);
            line.position.set(
                this.assetData.sizeX > 1 ? this.assetData.sizeX / 2 - 0.5 : 0,
                0.04,
                this.assetData.sizeY > 1 ? -this.assetData.sizeY / 2 + 0.5 : 0
            );
            this._circle = line;

            //Create label text
            this._div = document.createElement('div');
            this._div.className = 'objectDiv';

            this._textLabel = document.createElement('div');
            this._textLabel.className = 'textLabel';
            this._textLabel.textContent = this.assetData.label;
            this._div.appendChild(this._textLabel);

            this._healthBar = document.createElement('div');
            this._healthBar.className = 'health-bar';
            this._healthBar.dataset.dataTotal = this._health.toString();
            this._healthBar.dataset.dataValue = this._health.toString();

            this._bar = document.createElement('div');
            this._bar.className = this.assetData.labelClassName;
            this._healthBar.appendChild(this._bar);
            this._hit = document.createElement('div');
            this._hit.className = 'hit';
            this._bar.appendChild(this._hit);

            this._div.appendChild(this._healthBar);
            this._label = new CSS2DObject(this._div);
            this._label.position.set(
                this.assetData.sizeX > 1 ? this.assetData.sizeX / 2 - 0.5 : 0,
                this.assetData.labelAltitude,
                this.assetData.sizeY > 1 ? -this.assetData.sizeY / 2 + 0.5 : 0
            );
            this._label.layers.set(0);

            this.area = new THREE.BoxGeometry(this.assetData.sizeX / 2, 0.5, this.assetData.sizeY / 2);
            this.area.computeBoundingBox();

            this.area.translate(
                this.assetData.sizeX > 1 ? this.assetData.sizeX / 2 - 0.5 : 0,
                0,
                this.assetData.sizeY > 1 ? -this.assetData.sizeY / 2 + 0.5 : 0
            );
            /*const object = new THREE.Mesh(this.area, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
            this._helper = new THREE.BoxHelper(object, 0xffff00);
            this._engine.scene.add(this._helper);*/

            this.updateBox();
        }

        this._engine.scene.add(instancedMesh);
    }

    public updateBox = () => {
        this.mesh.updateMatrixWorld(true);
        if (this.assetData.targetable) {
            this.area.translate(this.data.position.y, 0, this.data.position.x);
            //this._helper.update();
        }
    };

    get targetable(): boolean {
        return this._targetable;
    }

    set targetable(_bool: boolean) {
        this._targetable = _bool;
    }

    get red(): boolean {
        return this._red;
    }

    set red(_bool: boolean) {
        if (_bool) {
            this.mesh.material = this.model.material;
            if (this.subMesh) {
                let indexSubModel = this._engine.uniqueModels.findIndex((model: any) => model.name === this.assetData.meshAnimation?.modelName);
                if (indexSubModel >= 0) {
                    this.subMesh.material = this._engine.uniqueModels[indexSubModel].material;
                }
            }
        } else {
            this.mesh.material = this._engine.materialRed;
            if (this.subMesh) {
                this.subMesh.material = this._engine.materialRed;
            }
        }
        this._red = _bool;
    }

    get selected(): boolean {
        return this._selected;
    }

    set selected(_bool: boolean) {
        if (_bool) {
            this.mesh.add(this._label);
            this.mesh.add(this._circle);
        } else {
            this.mesh.remove(this._label);
            this.mesh.remove(this._circle);
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

    public destroy = () => {
        this._engine.scene.remove(this.mesh);
        this.mesh.dispose();
    };

    public updateDirection = (_updateNext: boolean) => {
        let top = Object.keys(this._engine.gameObjects).find(
            (key: string) =>
                this._engine.gameObjects[key].assetData.name === this.assetData.name &&
                this._engine.gameObjects[key].data.position.y === this.data.position.y &&
                this._engine.gameObjects[key].data.position.x === this.data.position.x - 1
        );
        let bottom = Object.keys(this._engine.gameObjects).find(
            (key: string) =>
                this._engine.gameObjects[key].assetData.name === this.assetData.name &&
                this._engine.gameObjects[key].data.position.y === this.data.position.y &&
                this._engine.gameObjects[key].data.position.x === this.data.position.x + 1
        );
        let left = Object.keys(this._engine.gameObjects).find(
            (key: string) =>
                this._engine.gameObjects[key].assetData.name === this.assetData.name &&
                this._engine.gameObjects[key].data.position.y === this.data.position.y - 1 &&
                this._engine.gameObjects[key].data.position.x === this.data.position.x
        );
        let right = Object.keys(this._engine.gameObjects).find(
            (key: string) =>
                this._engine.gameObjects[key].assetData.name === this.assetData.name &&
                this._engine.gameObjects[key].data.position.y === this.data.position.y + 1 &&
                this._engine.gameObjects[key].data.position.x === this.data.position.x
        );
        if (top && left && bottom && right) {
            this._updateModel(`${this.assetData.name}2`, 0);
        } else if ((top && left && bottom) || (left && bottom && right) || (bottom && right && top) || (right && top && left)) {
            if (top && left && bottom) {
                this._updateModel(`${this.assetData.name}3`, -Math.PI / 2);
            } else if (left && bottom && right) {
                this._updateModel(`${this.assetData.name}3`, 0);
            } else if (bottom && right && top) {
                this._updateModel(`${this.assetData.name}3`, Math.PI / 2);
            } else {
                this._updateModel(`${this.assetData.name}3`, -Math.PI);
            }
        } else if ((top && left) || (left && bottom) || (bottom && right) || (right && top)) {
            if (top && left) {
                this._updateModel(`${this.assetData.name}4`, -Math.PI);
            } else if (left && bottom) {
                this._updateModel(`${this.assetData.name}4`, -Math.PI / 2);
            } else if (bottom && right) {
                this._updateModel(`${this.assetData.name}4`, 0);
            } else {
                this._updateModel(`${this.assetData.name}4`, Math.PI / 2);
            }
        } else if (top || bottom) {
            this._updateModel(this.assetData.name, Math.PI / 2);
        } else {
            this._updateModel(this.assetData.name, 0);
        }

        if (_updateNext) {
            if (top) this._engine.gameObjects[top].updateDirection(false);
            if (bottom) this._engine.gameObjects[bottom].updateDirection(false);
            if (left) this._engine.gameObjects[left].updateDirection(false);
            if (right) this._engine.gameObjects[right].updateDirection(false);
        }
    };

    private _updateModel = (_name: string, _rotation: number) => {
        if (this.data.object_id === 4 && this._engine.terrain.tiles[this.data.position.x][this.data.position.y].water) {
            _name += '_water';
        }
        if (this.mesh.name === _name) {
            this.mesh.rotation.set(0, _rotation, 0);
            return;
        }
        let indexModel = this._engine.uniqueModels.findIndex((x: any) => x.name === _name);
        if (indexModel <= -1) return;
        let instancedMesh = new THREE.InstancedMesh(this._engine.uniqueModels[indexModel].geometry, this._engine.uniqueModels[indexModel].material, 1);
        instancedMesh.rotation.set(0, _rotation, 0);
        instancedMesh.position.set(this.data.position.y, 0, this.data.position.x);
        instancedMesh.setMatrixAt(0, this._dummy.matrix);
        instancedMesh.name = _name;
        instancedMesh.castShadow = this.assetData.castShadow;
        this._engine.scene.remove(this.mesh);
        this.mesh.dispose();
        this.mesh = instancedMesh;
        this._engine.scene.add(this.mesh);
    };

    private _addMeshAnimation = (_modelName: string, _actionName: string) => {
        let indexModel = this._engine.uniqueModels.findIndex((model: any) => model.name === _modelName);
        if (indexModel >= 0) {
            const model = this._engine.uniqueModels[indexModel].clone();
            const mixer = new THREE.AnimationMixer(model);
            this._engine.mixers.push(mixer);
            this.mesh.add(model);
            this.subMesh = model;
            let indexAnimation = this._engine.animations.findIndex((animation: any) => animation.name === _actionName);
            if (indexAnimation >= 0) {
                const action = mixer.clipAction(this._engine.animations[indexAnimation]);
                action.play();
            }
        }
    };


    public update = () => {
        if (this.assetData.type === AssetType.Animal) {
            this._days += 1;
            let age;
            if (this._days > 365) {
                age = `Years: ${Math.round(this._days / 365)}`;
            } else if (this._days > 30 && this._days < 365) {
                age = `Months: ${Math.round(this._days / 30)}`;
            } else {
                age = `Days: ${this._days}`;
            }
            this._textLabel.textContent = `${this.assetData.label} / ${age}`;

            if (Math.random() < 0.5) {
                if (Math.random() < 0.5) {
                    // Move top
                    if (
                        this._engine.terrain.tiles[this.data.position.x - 1] &&
                        this._engine.terrain.tiles[this.data.position.x - 1][this.data.position.y] &&
                        this._engine.terrain.tiles[this.data.position.x - 1][this.data.position.y].empty &&
                        this._engine.terrain.tiles[this.data.position.x - 1][this.data.position.y].sold
                    ) {
                        this._engine.terrain.tiles[this.data.position.x][this.data.position.y].empty = true;
                        this._engine.terrain.tiles[this.data.position.x - 1][this.data.position.y].empty = false;
                        this.mesh.rotation.set(0, -Math.PI / 2, 0);
                        this.mesh.position.z = this.data.position.x - 1;
                        this.data.position.x = this.data.position.x - 1;
                        this.area.translate(0, 0, -1);
                        //this._helper.update();
                    }
                } else {
                    // Move bottom
                    if (
                        this._engine.terrain.tiles[this.data.position.x + 1] &&
                        this._engine.terrain.tiles[this.data.position.x + 1][this.data.position.y] &&
                        this._engine.terrain.tiles[this.data.position.x + 1][this.data.position.y].empty &&
                        this._engine.terrain.tiles[this.data.position.x + 1][this.data.position.y].sold
                    ) {
                        this._engine.terrain.tiles[this.data.position.x][this.data.position.y].empty = true;
                        this._engine.terrain.tiles[this.data.position.x + 1][this.data.position.y].empty = false;
                        this.mesh.rotation.set(0, Math.PI / 2, 0);
                        this.mesh.position.z = this.data.position.x + 1;
                        this.data.position.x = this.data.position.x + 1;
                        this.area.translate(0, 0, 1);
                        //this._helper.update();
                    }
                }
            } else {
                if (Math.random() < 0.5) {
                    // Move left
                    if (
                        this._engine.terrain.tiles[this.data.position.x] &&
                        this._engine.terrain.tiles[this.data.position.x][this.data.position.y - 1] &&
                        this._engine.terrain.tiles[this.data.position.x][this.data.position.y - 1].empty &&
                        this._engine.terrain.tiles[this.data.position.x][this.data.position.y - 1].sold
                    ) {
                        this._engine.terrain.tiles[this.data.position.x][this.data.position.y].empty = true;
                        this._engine.terrain.tiles[this.data.position.x][this.data.position.y - 1].empty = false;
                        this.mesh.rotation.set(0, 0, 0);
                        this.mesh.position.x = this.data.position.y - 1;
                        this.data.position.y = this.data.position.y - 1;
                        this.area.translate(-1, 0, 0);
                        //this._helper.update();
                    }
                } else {
                    // Move right
                    if (
                        this._engine.terrain.tiles[this.data.position.x] &&
                        this._engine.terrain.tiles[this.data.position.x][this.data.position.y + 1] &&
                        this._engine.terrain.tiles[this.data.position.x][this.data.position.y + 1].empty &&
                        this._engine.terrain.tiles[this.data.position.x][this.data.position.y + 1].sold
                    ) {
                        this._engine.terrain.tiles[this.data.position.x][this.data.position.y].empty = true;
                        this._engine.terrain.tiles[this.data.position.x][this.data.position.y + 1].empty = false;
                        this.mesh.rotation.set(0, Math.PI, 0);
                        this.mesh.position.x = this.data.position.y + 1;
                        this.data.position.y = this.data.position.y + 1;
                        this.area.translate(1, 0, 0);
                        //this._helper.update();
                    }
                }
            }
        }
    };
}
