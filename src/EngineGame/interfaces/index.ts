import { GameObject } from '../core/GameObject';

export interface IGameObject {
    [key: string]: GameObject;
}

export interface TerrainData {
    objects?: GameObjectData[];
    tiles?: TileData[];
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
    castShadow: boolean;
    name: string;
    object_id: number;
    targetable: boolean;
    label: string;
    label_altitude: number;
    width_size: number;
    length_size: number;
    rotation: number;
    position: GamePosition;
}

export interface GamePosition {
    x: number;
    y: number;
}
