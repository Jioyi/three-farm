import * as THREE from 'three';
import { TileData } from '../interfaces';

export class Terrain extends THREE.Mesh {
    public tiles: TileData[][] = [];
    private _mapSize: number = 96;
    private _mapUVs: number[];
    private _mapVertices: number[];

    constructor(tiles: TileData[]) {
        super();

        this._mapVertices = [];
        this._mapUVs = [];
        this.geometry = new THREE.BufferGeometry();

        const texture = new THREE.TextureLoader().load('assets/textures/texture_tile1.png');
        texture.offset = new THREE.Vector2(0.5, 0.5); // because the origin is in the middle of the tile
        texture.repeat.set(0.1, 0.1); // looks better but could be about 1 I think
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.material = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide, roughness: 1 });
        this.frustumCulled = false;
        this.receiveShadow = true;
        this.name = 'Terrain';

        const colorLinesCenter = 0x336600;
        const colorLinesGrid = new THREE.Color('#336600');
        const gridHelper = new THREE.GridHelper(this._mapSize, this._mapSize, colorLinesCenter, colorLinesGrid);
        gridHelper.name = 'grid';
        gridHelper.position.set(96 / 2 - 0.5, 0.001, this._mapSize / 2 - 0.5);
        this.add(gridHelper);

        this._assignGeometry(tiles);
    }

    private _assignGeometry(tiles: TileData[]) {
        this.tiles = Array(this._mapSize)
            .fill(this._mapSize)
            .map((entry) => Array(this._mapSize));

        tiles.forEach((tile) => (this.tiles[tile.position.x][tile.position.y] = tile));

        for (let row = 0; row < this.tiles.length; row++) {
            for (let col = 0; col < this.tiles.length; col++) {
                this.tiles[row][col].triangles = [];

                this.tiles[row][col].triangles?.push(
                    new THREE.Triangle(
                        new THREE.Vector3(col - 0.5, 0, row + 0.5),
                        new THREE.Vector3(col - 0.5, 0, row - 0.5),
                        new THREE.Vector3(col + 0.5, 0, row + 0.5)
                    )
                );

                this.tiles[row][col].triangles?.push(
                    new THREE.Triangle(
                        new THREE.Vector3(col - 0.5, 0, row - 0.5),
                        new THREE.Vector3(col + 0.5, 0, row - 0.5),
                        new THREE.Vector3(col + 0.5, 0, row + 0.5)
                    )
                );

                // Add vertices to buffer
                this.tiles[row][col].triangles?.forEach((element) => {
                    this._mapVertices.push(...element.a.toArray(), ...element.b.toArray(), ...element.c.toArray());
                    this._mapUVs.push(
                        element.a.toArray()[0],
                        element.a.toArray()[2],
                        element.b.toArray()[0],
                        element.b.toArray()[2],
                        element.c.toArray()[0],
                        element.c.toArray()[2]
                    );
                });
            }
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this._mapVertices), 3));
        this.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(this._mapUVs), 2));
        this.geometry.computeVertexNormals();
        this.geometry.attributes.position.needsUpdate = true;
    }
}

export const constrain = (num: number, limit: number) => {
    return Math.max(Math.min(num, limit), 0);
};
