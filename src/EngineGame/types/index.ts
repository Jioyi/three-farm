export interface TerrainData {
    objects?: GameObjectData[];
    tiles?: TileData[];
}

export interface TileData {
    elevation: number;
    actualElevation: number;
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
    label: string;
    label_altitude: number;
    width_size: number;
    length_size: number;
    rotation: number;
    position: {
        x: number;
        y: number;
    };
}
