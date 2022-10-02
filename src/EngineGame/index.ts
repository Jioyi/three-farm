import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GamePosition, IGameObject, TerrainData } from './interfaces';
import { Terrain } from './core/Terrain';
import { GameObject } from './core/GameObject';
import RayMouse from './core/RayMouse';
import './style/base.css';

export default class EngineGame {
    protected _mapSize = 96;
    protected _cameraStarted: GamePosition = { x: 12, y: 12 };

    public _canvas: HTMLCanvasElement;
    public _scene: THREE.Scene;
    public _renderer: THREE.WebGLRenderer;
    public _labelRenderer: CSS2DRenderer;
    public _orbitControls: OrbitControls;
    public _camera: THREE.PerspectiveCamera;
    public _ocamera: THREE.OrthographicCamera;

    public _uniqueModels: any[] = [];

    private _eventGameHandler: (...args: any[]) => any;
    private _stats: Stats;
    private _clock: THREE.Clock;

    private _gameObjects: IGameObject = {} as IGameObject;
    private _rayMouse!: RayMouse;
    private _mixers: THREE.AnimationMixer[] = [];
    private _animations!: THREE.AnimationClip[];

    constructor(_canvas: HTMLCanvasElement, _eventGameHandler: (...args: any[]) => any) {
        this._canvas = _canvas;
        this._eventGameHandler = _eventGameHandler;
        this._scene = new THREE.Scene();

        //this._createMapJson();
        // Build Render
        this._renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            antialias: true
        });
        this._renderer.domElement.id = 'EngineGameCanvas';
        this._renderer.outputEncoding = THREE.sRGBEncoding;
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this._renderer.toneMapping = THREE.CineonToneMapping;
        this._renderer.shadowMap.needsUpdate = true;
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', this._onWindowResize, false);

        // Build Label Render
        this._labelRenderer = new CSS2DRenderer();
        this._labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this._labelRenderer.domElement.style.position = 'absolute';
        this._labelRenderer.domElement.style.top = '0px';
        document.body.appendChild(this._labelRenderer.domElement);

        // Build Stats
        this._stats = Stats();
        this._stats.domElement.style.cssText = 'display:flex;position:absolute;top:56px;left:0px;';
        document.body.append(this._stats.dom);

        // Build Camera
        this._camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._camera.layers.enableAll();
        this._camera.layers.toggle(1);
        this._camera.position.set(this._cameraStarted.x - 15, 25, this._cameraStarted.y + 15);

        // Build OCamera: is used to render selection ribbon
        this._ocamera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 1000);
        this._scene.add(this._ocamera);

        this._ocamera.position.x = 0;
        this._ocamera.position.y = 0;
        this._ocamera.position.z = 100;
        this._ocamera.lookAt(0, 0, 0);
        this._ocamera.layers.set(1);

        // Build Orbit Controls
        this._orbitControls = new OrbitControls(this._camera, this._labelRenderer.domElement);
        this._orbitControls.enableRotate = false;
        this._orbitControls.maxDistance = 45;
        this._orbitControls.minDistance = 3;
        this._orbitControls.screenSpacePanning = false;
        this._orbitControls.target.set(this._cameraStarted.x, 0, this._cameraStarted.y);
        this._orbitControls.update();

        this._buildLights();
        this._buildRayMouse();
        this._loadTerrainData('assets/terrains/terrain1.json');

        this._clock = new THREE.Clock();
        this._RAF();
    }

    private _onWindowResize = () => {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();

        this._ocamera.left = window.innerWidth / -2;
        this._ocamera.right = window.innerWidth / 2;
        this._ocamera.top = window.innerHeight / 2;
        this._ocamera.bottom = window.innerHeight / -2;
        this._ocamera.updateProjectionMatrix();

        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._labelRenderer.setSize(window.innerWidth, window.innerHeight);
    };

    private _RAF() {
        const deltaTime = this._clock.getDelta();
        this._update(deltaTime);

        this._renderer.render(this._scene, this._camera);
        this._labelRenderer.render(this._scene, this._camera);
        this._renderer.autoClear = false;

        this._renderer.render(this._scene, this._ocamera);
        this._renderer.autoClear = true;

        requestAnimationFrame(() => this._RAF());
    }

    private _update = (_deltaTime: number) => {
        this._stats.update();
        this._orbitControls.update();
        if (this._mixers.length !== 0) {
            for (let i = 0, l = this._mixers.length; i < l; i++) {
                this._mixers[i].update(_deltaTime);
            }
        }
    };

    private _buildLights = () => {
        const pointLight = new THREE.PointLight(0xffffff, 0.7);
        pointLight.position.set(-25, 80, 25);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 1024;
        pointLight.shadow.mapSize.height = 1024;
        this._scene.add(pointLight);

        var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this._scene.add(ambientLight);
    };

    private _createMapJson = () => {
        const generateMap: any = {
            objects: [],
            tiles: []
        };

        for (let y = 0; y < this._mapSize; y++) {
            for (let x = 0; x < this._mapSize; x++) {
                generateMap.tiles.push({
                    empty: true,
                    sold: false,
                    position: { x: x, y: y }
                });
            }
        }

        for (let y = 0; y < this._mapSize; y++) {
            for (let x = 0; x < this._mapSize; x++) {
                //1% probability of getting true
                if (Math.random() < 0.01) {
                    //80% probability of getting true
                    if (Math.random() < 0.8) {
                        generateMap.objects.push({
                            name: 'tree1',
                            label: 'Tree',
                            targetable: true,
                            width_size: 1,
                            length_size: 1,
                            label_altitude: 1.3,
                            object_id: 0,
                            rotation: Math.random() * Math.PI,
                            position: { x: x, y: y },
                            castShadow: true
                        });
                    } else {
                        generateMap.objects.push({
                            name: 'stone1',
                            label: 'Stone',
                            targetable: true,
                            width_size: 1,
                            length_size: 1,
                            label_altitude: 1.1,
                            object_id: 1,
                            rotation: Math.random() * Math.PI,
                            position: { x: x, y: y },
                            castShadow: true
                        });
                    }
                }
            }
        }

        const farmSize = 24;
        for (let y = 0; y < farmSize; y++) {
            for (let x = 0; x < farmSize; x++) {
                let e = generateMap.tiles.findIndex((tile: any) => tile.position.y === y && tile.position.x === x);
                if (e >= 0) {
                    generateMap.tiles[e].sold = true;
                }
                if (y > 0 && y < farmSize - 1 && x > 0 && x < farmSize - 1) continue;
                let i = generateMap.objects.findIndex((obj: any) => obj.position.y === y && obj.position.x === x);
                if (i >= 0) {
                    generateMap.objects.splice(i, 1);
                }
                generateMap.objects.push({
                    name: 'fence1',
                    label: 'Fence',
                    targetable: false,
                    width_size: 1,
                    length_size: 1,
                    label_altitude: 0.5,
                    object_id: 2,
                    rotation: 0,
                    position: { x: x, y: y },
                    castShadow: true
                });
            }
        }

        var a = document.createElement('a');
        var file = new Blob([JSON.stringify(generateMap, null, 0)], { type: 'text/plain' });
        a.href = URL.createObjectURL(file);
        a.download = 'json.txt';
        a.click();
    };

    private async _loadTerrainData(_filepath: string) {
        const response = await fetch(_filepath);
        const terrainData = (await response.json()) as TerrainData;

        const terrainMesh = new Terrain(terrainData.tiles!);
        this._scene.add(terrainMesh);

        const manager = new THREE.LoadingManager();
        manager.onLoad = () => {
            this._eventGameHandler({ type: 'progress', data: 99 });
            setTimeout(() => {
                this._eventGameHandler({ type: 'loading', data: false });
            }, 2000);
        };
        manager.onProgress = (_url, _itemsLoaded, _itemsTotal) => {
            this._eventGameHandler({ type: 'progress', data: Math.round((_itemsLoaded / _itemsTotal) * 100) });
        };

        const loader = new GLTFLoader(manager);
        loader.crossOrigin = 'anonymous';
        const gltf = await loader.loadAsync(`assets/models/farm-assets.glb`);
        this._animations = gltf.animations;

        for (let child of gltf.scene.children) {
            this._uniqueModels.push(child);
        }

        for (let object of terrainData.objects!) {
            let i = this._uniqueModels.findIndex((x: any) => x.name === object.name);
            if (i <= -1) continue;

            let tile = (this._scene.getObjectByName('Terrain')! as Terrain).tiles[object.position.x][object.position.y];
            if (!tile.empty) continue;
            tile.empty = false;

            const gameObject = new GameObject(
                this._scene,
                object,
                this._uniqueModels[i],
                this._uniqueModels,
                this._mixers,
                this._animations,
                this._gameObjects
            );
            this._gameObjects[gameObject.uuid] = gameObject;
        }

        for (let key of Object.keys(this._gameObjects)) {
            if (this._gameObjects[key].data.name.includes('fence')) this._gameObjects[key].updateFence();
        }
    }

    private _buildRayMouse() {
        this._rayMouse = new RayMouse(this._gameObjects, this._labelRenderer, this._scene, this._camera, this._orbitControls, this._eventGameHandler);
    }

    public testFunct(_string: string) {
        console.log('testFunct', _string);
    }
}
