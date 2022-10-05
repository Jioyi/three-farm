import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GameData, GamePosition, IGameObject, TerrainData } from './interfaces';
import { Terrain } from './core/Terrain';
import { GameObject } from './core/GameObject';
import MouseEvents from './core/MouseEvents';
import './style/base.css';
import { BasicSoundController } from './core/BasicSoundController';

export default class EngineGame {
    protected _cameraStarted: GamePosition = { x: 12, y: 12 };
    protected _pixelRatio: number = 1;

    public mapSize = 96;
    public canvas: HTMLCanvasElement;
    public scene: THREE.Scene;
    public renderer: THREE.WebGLRenderer;
    public labelRenderer: CSS2DRenderer;
    public orbitControls: OrbitControls;
    public camera: THREE.PerspectiveCamera;
    public ocamera: THREE.OrthographicCamera;
    public materialRed: THREE.MeshStandardMaterial;

    public terrain!: Terrain;
    public gameData!: GameData;
    public gameObjects: IGameObject = {} as IGameObject;
    public uniqueModels: any[] = [];
    public mixers: THREE.AnimationMixer[] = [];
    public animations!: THREE.AnimationClip[];
    public soundController: BasicSoundController;

    private _money: number = 0;
    private _eventGameHandler: (...args: any[]) => any;
    private _stats: Stats;
    private _clock: THREE.Clock;

    private _mouseEvents!: MouseEvents;
    private _terrainData!: TerrainData;
    private _loadingManager!: THREE.LoadingManager;

    constructor(_canvas: HTMLCanvasElement, _eventGameHandler: (...args: any[]) => any) {
        this.canvas = _canvas;
        this._eventGameHandler = _eventGameHandler;
        this.scene = new THREE.Scene();

        this.materialRed = new THREE.MeshStandardMaterial({ color: 0xff1313, side: THREE.DoubleSide, roughness: 1, transparent: true, opacity: 0.3 });

        //this._createMapJson();
        // Build Render
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.domElement.id = 'EngineGameCanvas';
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.CineonToneMapping;
        this.renderer.shadowMap.needsUpdate = true;
        this.renderer.setPixelRatio(window.devicePixelRatio * this._pixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', this._onWindowResize, false);

        // Build Label Render
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        document.body.appendChild(this.labelRenderer.domElement);

        // Build Stats
        this._stats = Stats();
        this._stats.domElement.style.cssText = 'display:flex;position:absolute;top:88px;right:10px;';
        document.body.append(this._stats.dom);

        // Build Camera
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.layers.enableAll();
        this.camera.layers.toggle(1);
        this.camera.position.set(this._cameraStarted.x - 15, 25, this._cameraStarted.y + 15);

        // Build OCamera: is used to render selection ribbon
        this.ocamera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 1000);
        this.scene.add(this.ocamera);

        this.ocamera.position.x = 0;
        this.ocamera.position.y = 0;
        this.ocamera.position.z = 100;
        this.ocamera.lookAt(0, 0, 0);
        this.ocamera.layers.set(1);

        // Build Orbit Controls
        this.orbitControls = new OrbitControls(this.camera, this.labelRenderer.domElement);
        this.orbitControls.enableRotate = false;
        this.orbitControls.maxDistance = 45;
        this.orbitControls.minDistance = 3;
        this.orbitControls.screenSpacePanning = false;
        this.orbitControls.target.set(this._cameraStarted.x, 0, this._cameraStarted.y);
        this.orbitControls.update();

        // Build  Sound controller
        this.soundController = new BasicSoundController();
        this._init();

        this._clock = new THREE.Clock();
        this._RAF();
    }

    private _init = async () => {
        this._buildLights();
        await this._loadGameData('assets/data/game_data.json');
        await this._loadTerrainData('assets/terrains/terrain1.json');
        this._buildLoadingManager();
        await this._generateMap();
        this._buildMouseEvents();
    };

    private _onWindowResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.ocamera.left = window.innerWidth / -2;
        this.ocamera.right = window.innerWidth / 2;
        this.ocamera.top = window.innerHeight / 2;
        this.ocamera.bottom = window.innerHeight / -2;
        this.ocamera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    };

    private _RAF() {
        const deltaTime = this._clock.getDelta();
        this._update(deltaTime);

        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
        this.renderer.autoClear = false;

        this.renderer.render(this.scene, this.ocamera);
        this.renderer.autoClear = true;

        requestAnimationFrame(() => this._RAF());
    }

    private _update = (_deltaTime: number) => {
        this._stats.update();
        this.orbitControls.update();
        if (this.mixers.length !== 0) {
            for (let i = 0, l = this.mixers.length; i < l; i++) {
                this.mixers[i].update(_deltaTime);
            }
        }
    };

    private _buildLights = () => {
        const pointLight = new THREE.PointLight(0xffffff, 0.7);
        pointLight.position.set(-25, 80, 25);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 1024;
        pointLight.shadow.mapSize.height = 1024;
        this.scene.add(pointLight);

        var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
    };

    private _createMapJson = () => {
        const generatedMap: any = {
            objects: [],
            tiles: []
        };

        for (let y = 0; y < this.mapSize; y++) {
            for (let x = 0; x < this.mapSize; x++) {
                generatedMap.tiles.push({ empty: true, sold: false, position: { x: x, y: y } });
                //1% probability of getting true
                if (Math.random() < 0.01) {
                    //80% probability of getting true
                    if (Math.random() < 0.8) {
                        generatedMap.objects.push({ object_id: 0, rotation: 0, position: { x: x, y: y } });
                    } else {
                        generatedMap.objects.push({ object_id: 1, rotation: 0, position: { x: x, y: y } });
                    }
                }
            }
        }

        const farmSize = 24;
        for (let y = 0; y < farmSize; y++) {
            for (let x = 0; x < farmSize; x++) {
                let indexTile = generatedMap.tiles.findIndex((tile: any) => tile.position.y === y && tile.position.x === x);
                if (indexTile >= 0) {
                    generatedMap.tiles[indexTile].sold = true;
                }
                if (y > 0 && y < farmSize - 1 && x > 0 && x < farmSize - 1) continue;
                generatedMap.objects.push({ object_id: 2, rotation: 0, position: { x: x, y: y } });
            }
        }

        const baseAssets = [
            { object_id: 11, rotation: 0, position: { x: 3, y: 1 } },
            { object_id: 10, rotation: 0, position: { x: 2, y: 8 } },
            { object_id: 10, rotation: 0, position: { x: 2, y: 10 } }
        ];

        for (let i = 0; i < baseAssets.length; i++) {
            /*let indexObject = generatedMap.objects.findIndex(
                (obj: any) => obj.position.y === baseAssets[i].position.y && obj.position.x === baseAssets[i].position.y
            );
            if (indexObject >= 0) {
                generatedMap.objects.splice(indexObject, 1);
            }*/
            generatedMap.objects.push(baseAssets[i]);
        }

        var a = document.createElement('a');
        var file = new Blob([JSON.stringify(generatedMap, null, 0)], { type: 'text/plain' });
        a.href = URL.createObjectURL(file);
        a.download = 'json.txt';
        a.click();
    };

    private async _loadGameData(_filepath: string) {
        const response = await fetch(_filepath);
        this.gameData = (await response.json()) as GameData;
        this._eventGameHandler({ type: 'setGameData', data: this.gameData });
        this.money = this.gameData.money;
    }

    private async _loadTerrainData(_filepath: string) {
        const response = await fetch(_filepath);
        this._terrainData = (await response.json()) as TerrainData;
    }

    private _buildLoadingManager() {
        this._loadingManager = new THREE.LoadingManager();
        this._loadingManager.onLoad = () => {
            this._eventGameHandler({ type: 'progress', data: 99 });
            setTimeout(() => {
                this._eventGameHandler({ type: 'loading', data: false });
            }, 2000);
        };
        this._loadingManager.onProgress = (_url, _itemsLoaded, _itemsTotal) => {
            this._eventGameHandler({ type: 'progress', data: Math.round((_itemsLoaded / _itemsTotal) * 100) });
        };
    }

    private async _generateMap() {
        const terrainMesh = new Terrain(this._terrainData.tiles!);
        this.scene.add(terrainMesh);
        this.terrain = terrainMesh;

        const loader = new GLTFLoader(this._loadingManager);
        loader.crossOrigin = 'anonymous';
        const gltf = await loader.loadAsync(`assets/models/farm-assets.glb`);
        this.animations = gltf.animations;

        for (let child of gltf.scene.children) {
            this.uniqueModels.push(child);
        }

        for (let object of this._terrainData.objects!) {
            let assetIndex = this.gameData.assets.findIndex((asset) => asset.id === object.object_id);
            if (assetIndex <= -1) continue;

            let modelIndex = this.uniqueModels.findIndex((model: any) => model.name === this.gameData.assets[assetIndex].name);
            if (modelIndex <= -1) continue;

            for (let x = object.position.x; x > object.position.x - this.gameData.assets[assetIndex].sizeX; x--) {
                for (let y = object.position.y; y < object.position.y + this.gameData.assets[assetIndex].sizeY; y++) {
                    this.terrain.tiles[x][y].empty = false;
                }
            }

            const gameObject = new GameObject(this, object);
            this.gameObjects[gameObject.uuid] = gameObject;
            if (gameObject.assetData.name.includes('fence')) gameObject.updateFence(true);
        }
    }

    private _buildMouseEvents() {
        this._mouseEvents = new MouseEvents(this, this._eventGameHandler);
    }

    public createGameObject(_nameAssets: string) {
        this._mouseEvents.createGameObject(_nameAssets);
    }

    public changeVolume(_volume: number) {
        this.soundController.changeVolume(_volume);
    }

    get money(): number {
        return this._money;
    }

    set money(_number: number) {
        this._eventGameHandler({ type: 'setMoney', data: _number });
        this._money = _number;
    }
}
