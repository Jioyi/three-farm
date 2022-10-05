import { GameObject } from '../core/GameObject';

export interface IGameObject {
    [key: string]: GameObject;
}

export interface TerrainData {
    objects?: GameObjectData[];
    tiles?: TileData[];
}

export interface SlostData {
    sold: boolean;
    price: number;
    position: {
        x: number;
        y: number;
    };
    grid: THREE.GridHelper;
}

export interface TileData {
    empty: boolean;
    sold: boolean;
    position: {
        x: number;
        y: number;
    };
    terrain?: number;
    quadVertices?: number[];
    triangles?: THREE.Triangle[];
}

export interface GameObjectData {
    uuid?: string;
    object_id: number;
    rotation: number;
    position: GamePosition;
}

export interface GamePosition {
    x: number;
    y: number;
}

export interface GameData {
    money: number;
    categories: CategoryData[];
    assets: AssetData[];
}

export interface CategoryData {
    id: number;
    name: string;
    image: string;
    assets: number[];
}

export interface AssetData {
    id: number;
    name: string;
    targetable: boolean;
    meshAnimation?: meshAnimation;
    label: string;
    labelAltitude: number;
    labelClassName: string;
    sizeX: number;
    sizeY: number;
    castShadow: boolean;
    autoRotate: boolean;
    image: string;
    imageModel: string;
    price: number;
    description: string;
}

export interface meshAnimation {
    modelName: string;
    actionName: string;
}
