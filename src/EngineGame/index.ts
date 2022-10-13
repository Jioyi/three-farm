import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GameData, GamePosition, IGameObject, SlostData, TerrainData } from './interfaces';
import { Terrain } from './core/Terrain';
import { GameObject } from './core/GameObject';
import MouseEvents from './core/MouseEvents';
import './style/base.css';
import { BasicSoundController } from './core/BasicSoundController';
import { CalendarController } from './core/CalendarController';
import { AssetType } from './interfaces/index';

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
    public materialLine = new LineMaterial({
        color: 0xffffff,
        linewidth: 0.05,
        dashed: false,
        worldUnits: true
    });

    public terrain!: Terrain;
    public gameData!: GameData;
    public gameObjects: IGameObject = {} as IGameObject;
    public uniqueModels: any[] = [];
    public mixers: THREE.AnimationMixer[] = [];
    public animations!: THREE.AnimationClip[];
    public soundController: BasicSoundController;

    private _money: number = 0;
    private _storage: number = 0;
    private _eventGameHandler: (...args: any[]) => any;
    private _stats: Stats;
    private _clock: THREE.Clock;

    private _mouseEvents!: MouseEvents;
    private _terrainData!: TerrainData;
    private _loadingManager!: THREE.LoadingManager;

    private _slots: SlostData[][] = [];
    private _colorGreen = 0x336600;
    private _colorLinesGreen = new THREE.Color('#336600');
    private _colorRed = 0xff0000;
    private _colorLinesRed = new THREE.Color('#ff0000');
    private _calendarController!: CalendarController;

    constructor(_canvas: HTMLCanvasElement, _eventGameHandler: (...args: any[]) => any) {
        this.canvas = _canvas;
        this._eventGameHandler = _eventGameHandler;
        this.scene = new THREE.Scene();

        this.materialRed = new THREE.MeshStandardMaterial({ color: 0xff1313, side: THREE.DoubleSide, roughness: 1, transparent: true, opacity: 0.3 });

        //this._createMapJson();

        let AA = true;
        if (window.devicePixelRatio > 1) AA = false;

        // Build Render
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: AA
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

        let FOV;
        let FAR;

        // Mobile camera
        if (window.innerWidth <= 768) {
            FOV = 50;
            FAR = 1200;
            // 769px - 1080px screen width camera
        } else if (window.innerWidth >= 769 && window.innerWidth <= 1080) {
            FOV = 50;
            FAR = 1475;
            // > 1080px screen width res camera
        } else {
            FOV = 40;
            FAR = 1800;
        }

        // Build Camera
        this.camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, FAR);
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
        this._generateSlots();
        await this._generateMap();
        this._buildMouseEvents();
        this._startGame();
    };

    private _startGame = () => {
        this._calendarController = new CalendarController(this, this._eventGameHandler.bind(this));
        this._calendarController.start();
    };

    private _pauseGame = () => {
        //const myTimeout = setTimeout(this._addDay, 1000 * this._speedGame);
    };

    private _generateSlots = () => {
        const slotSize = 12;
        this._slots = Array(slotSize)
            .fill(slotSize)
            .map((_entry) => Array(slotSize));

        for (let x = 0; x < slotSize; x++) {
            for (let y = 0; y < slotSize; y++) {
                const extraPrice = (16144 * x) / 10 + (16144 * y) / 10;

                const slotGrid = new THREE.GridHelper(
                    8,
                    8,
                    y < 3 && x < 3 ? this._colorGreen : this._colorRed,
                    y < 3 && x < 3 ? this._colorLinesGreen : this._colorLinesRed
                );
                slotGrid.name = 'SlotGrid';
                slotGrid.position.set(y * 8 + 3.5, 0.001, x * 8 + 3.5);
                this.scene.add(slotGrid);
                const slot: SlostData = {
                    grid: slotGrid,
                    sold: y < 3 && x < 3 ? true : false,
                    price: Math.round(16144 + extraPrice),
                    position: { x: x, y: y }
                };
                this._slots[x][y] = slot;
            }
        }

        this._eventGameHandler({ type: 'setSlots', data: this._slots });
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

        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
    };

    private _createMapJson = () => {
        const generatedMap: any = {
            objects: [],
            tiles: []
        };

        const farmSize = 24;

        for (let y = 0; y < this.mapSize; y++) {
            for (let x = 0; x < this.mapSize; x++) {
                generatedMap.tiles.push({ empty: true, sold: false, water: false, position: { x: x, y: y } });

                if (y < farmSize && x < farmSize) continue;
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
            { object_id: 10, rotation: 0, position: { x: 13, y: 9 } },
            { object_id: 12, rotation: 0, position: { x: 1, y: 5 } },
            { object_id: 3, rotation: 0, position: { x: 22, y: 1 } },
            { object_id: 3, rotation: 0, position: { x: 22, y: 10 } },
            { object_id: 11, rotation: 0, position: { x: 3, y: 1 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 1 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 2 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 3 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 4 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 5 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 6 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 7 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 8 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 9 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 10 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 11 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 12 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 13 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 14 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 15 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 16 } },
            { object_id: 4, rotation: 0, position: { x: 14, y: 17 } },
            { object_id: 4, rotation: 0, position: { x: 15, y: 9 } },
            { object_id: 4, rotation: 0, position: { x: 16, y: 9 } },
            { object_id: 4, rotation: 0, position: { x: 17, y: 9 } },
            { object_id: 4, rotation: 0, position: { x: 18, y: 9 } },
            { object_id: 4, rotation: 0, position: { x: 19, y: 9 } },
            { object_id: 4, rotation: 0, position: { x: 20, y: 9 } },
            { object_id: 4, rotation: 0, position: { x: 21, y: 9 } },
            { object_id: 4, rotation: 0, position: { x: 22, y: 9 } },
            { object_id: 2, rotation: 0, position: { x: 14, y: 18 } },
            { object_id: 2, rotation: 0, position: { x: 14, y: 19 } },
            { object_id: 2, rotation: 0, position: { x: 14, y: 20 } },
            { object_id: 2, rotation: 0, position: { x: 14, y: 21 } },
            { object_id: 2, rotation: 0, position: { x: 14, y: 22 } },
            { object_id: 2, rotation: 0, position: { x: 15, y: 18 } },
            { object_id: 2, rotation: 0, position: { x: 16, y: 18 } },
            { object_id: 2, rotation: 0, position: { x: 17, y: 18 } },
            { object_id: 2, rotation: 0, position: { x: 18, y: 18 } },
            { object_id: 2, rotation: 0, position: { x: 19, y: 18 } },
            { object_id: 2, rotation: 0, position: { x: 20, y: 18 } },
            { object_id: 2, rotation: 0, position: { x: 21, y: 18 } },
            { object_id: 2, rotation: 0, position: { x: 22, y: 18 } },
            { object_id: 5, rotation: 0, position: { x: 18, y: 19 } },
            { object_id: 5, rotation: 0, position: { x: 18, y: 21 } },
            { object_id: 5, rotation: 0, position: { x: 22, y: 19 } },
            { object_id: 5, rotation: 0, position: { x: 21, y: 22 } }
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
        this._loadingManager.onLoad = async () => {
            this._eventGameHandler({ type: 'progress', data: 99 });
            setTimeout(() => {
                this._eventGameHandler({ type: 'loading', data: false }); //this._LoadCacheImages();
            }, 3000);
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

            if (object.object_id === 10) {
                for (
                    let x = object.position.x + this.gameData.assets[assetIndex].surface;
                    x >= object.position.x - this.gameData.assets[assetIndex].surface;
                    x--
                ) {
                    for (
                        let y = object.position.y - this.gameData.assets[assetIndex].surface;
                        y <= object.position.y + this.gameData.assets[assetIndex].surface;
                        y++
                    ) {
                        if (this.terrain.tiles[x] && this.terrain.tiles[x][y]) {
                            this.terrain.tiles[x][y].water = true;
                        }
                    }
                }
            }

            if (this.gameData.assets[assetIndex].type === 'storage') {
                this.storage += this.gameData.assets[assetIndex].sizeX * this.gameData.assets[assetIndex].sizeY;
            }

            const gameObject = new GameObject(this, object);
            this.gameObjects[gameObject.uuid] = gameObject;
            if (gameObject.assetData.name === 'fence' || gameObject.assetData.name === 'ditch') gameObject.updateDirection(true);
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

    get storage(): number {
        return this._storage;
    }

    set storage(_number: number) {
        this._eventGameHandler({ type: 'setStorage', data: _number });
        this._storage = _number;
    }

    public buySlot(_x: number, _y: number) {
        if (this._slots[_x][_y].sold) return;
        if (this.money < this._slots[_x][_y].price) return;

        for (let x = _x * 8; x < _x * 8 + 8; x++) {
            for (let y = _y; y < _y * 8 + 8; y++) {
                this.terrain.tiles[x][y].sold = true;
            }
        }

        this.money -= this._slots[_x][_y].price;
        this._slots[_x][_y].sold = true;
        this._eventGameHandler({ type: 'setSlots', data: this._slots });

        const newSlotGrid = new THREE.GridHelper(8, 8, this._colorGreen, this._colorLinesGreen);
        newSlotGrid.name = 'SlotGrid';
        newSlotGrid.position.set(_y * 8 + 3.5, 0.001, _x * 8 + 3.5);
        this.scene.remove(this._slots[_x][_y].grid);
        this._slots[_x][_y].grid = newSlotGrid;
        this.scene.add(newSlotGrid);
    }

    public sellSlot(_x: number, _y: number) {
        if (!this._slots[_x][_y].sold) return;

        let isPossible = true;

        for (let x = _x * 8; x < _x * 8 + 8; x++) {
            for (let y = _y; y < _y * 8 + 8; y++) {
                if (!this.terrain.tiles[x][y].empty) isPossible = false;
            }
        }

        if (!isPossible) return;

        for (let x = _x * 8; x < _x * 8 + 8; x++) {
            for (let y = _y; y < _y * 8 + 8; y++) {
                this.terrain.tiles[x][y].sold = false;
            }
        }

        this.money += this._slots[_x][_y].price;
        this._slots[_x][_y].sold = false;
        this._eventGameHandler({ type: 'setSlots', data: this._slots });

        const newSlotGrid = new THREE.GridHelper(8, 8, this._colorRed, this._colorLinesRed);
        newSlotGrid.name = 'SlotGrid';
        newSlotGrid.position.set(_y * 8 + 3.5, 0.001, _x * 8 + 3.5);
        this.scene.remove(this._slots[_x][_y].grid);
        this._slots[_x][_y].grid = newSlotGrid;
        this.scene.add(newSlotGrid);
    }

    public updateCropsAndAnimals = () => {
        for (let key of Object.keys(this.gameObjects)) {
            if (this.gameObjects[key].assetData.type === AssetType.Animal || this.gameObjects[key].assetData.type === AssetType.Crop)
                this.gameObjects[key].update();
        }
    };
}
