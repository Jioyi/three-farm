import * as THREE from 'three';
import { TileData } from '../types';

export class Terrain extends THREE.Mesh {
    public tiles: TileData[][] = [];
    private _mapUVs: number[];
    private _mapVertices: number[];
    private _elevationScale: number = 0.3;

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
        this._assignGeometry(tiles);
    }

    get elevationScale(): number {
        return this._elevationScale;
    }
    set elevationScale(value: number) {
        this._elevationScale = value;
    }

    private _assignGeometry(tiles: TileData[]) {
        const dim = 96;
        this.tiles = Array(dim)
            .fill(dim)
            .map((entry) => Array(dim));

        tiles.forEach((tile) => (this.tiles[tile.position.x][tile.position.y] = tile));

        let vertices = Array(dim + 1)
            .fill(dim + 1)
            .map((entry) => Array(dim + 1));
        for (let row = 0; row < vertices.length; row++) {
            for (let col = 0; col < vertices.length; col++) {
                vertices[row][col] = Math.max(
                    this.tiles[constrain(row, dim - 1)][constrain(col, dim - 1)].elevation,
                    this.tiles[constrain(row - 1, dim - 1)][constrain(col, dim - 1)].elevation,
                    this.tiles[constrain(row - 1, dim - 1)][constrain(col - 1, dim - 1)].elevation,
                    this.tiles[constrain(row, dim - 1)][constrain(col - 1, dim - 1)].elevation
                );
            }
        }

        for (let row = 0; row < this.tiles.length; row++) {
            for (let col = 0; col < this.tiles.length; col++) {
                const quadVertices = [
                    vertices[row + 1][col] * this.elevationScale,
                    vertices[row][col] * this.elevationScale,
                    vertices[row][col + 1] * this.elevationScale,
                    vertices[row + 1][col + 1] * this.elevationScale
                ];

                this.tiles[row][col].triangles = [];
                const vertexSum = quadVertices.reduce((a, b) => a + b) / this.elevationScale - 4 * this.tiles[row][col].elevation;

                // one up corner
                if (vertexSum === 1) {
                    this.tiles[row][col].actualElevation = this.tiles[row][col].elevation + 0.25;
                    if (quadVertices[0] || quadVertices[2]) {
                        // use forward slash
                        this.tiles[row][col].triangles?.push(
                            new THREE.Triangle(
                                new THREE.Vector3(col - 0.5, quadVertices[0], row + 0.5),
                                new THREE.Vector3(col - 0.5, quadVertices[1], row - 0.5),
                                new THREE.Vector3(col + 0.5, quadVertices[3], row + 0.5)
                            )
                        );

                        this.tiles[row][col].triangles?.push(
                            new THREE.Triangle(
                                new THREE.Vector3(col - 0.5, quadVertices[1], row - 0.5),
                                new THREE.Vector3(col + 0.5, quadVertices[2], row - 0.5),
                                new THREE.Vector3(col + 0.5, quadVertices[3], row + 0.5)
                            )
                        );
                    } else {
                        // backslash
                        this.tiles[row][col].triangles?.push(
                            new THREE.Triangle(
                                new THREE.Vector3(col - 0.5, quadVertices[0], row + 0.5),
                                new THREE.Vector3(col - 0.5, quadVertices[1], row - 0.5),
                                new THREE.Vector3(col + 0.5, quadVertices[2], row - 0.5)
                            )
                        );

                        this.tiles[row][col].triangles?.push(
                            new THREE.Triangle(
                                new THREE.Vector3(col - 0.5, quadVertices[0], row + 0.5),
                                new THREE.Vector3(col + 0.5, quadVertices[2], row - 0.5),
                                new THREE.Vector3(col + 0.5, quadVertices[3], row + 0.5)
                            )
                        );
                    }
                } else if (vertexSum === 3) {
                    // three up corner
                    this.tiles[row][col].actualElevation = this.tiles[row][col].elevation + 0.75;
                    if (!quadVertices[0] || !quadVertices[2]) {
                        // use forward slash
                        this.tiles[row][col].triangles?.push(
                            new THREE.Triangle(
                                new THREE.Vector3(col - 0.5, quadVertices[0], row + 0.5),
                                new THREE.Vector3(col - 0.5, quadVertices[1], row - 0.5),
                                new THREE.Vector3(col + 0.5, quadVertices[3], row + 0.5)
                            )
                        );

                        this.tiles[row][col].triangles?.push(
                            new THREE.Triangle(
                                new THREE.Vector3(col - 0.5, quadVertices[1], row - 0.5),
                                new THREE.Vector3(col + 0.5, quadVertices[2], row - 0.5),
                                new THREE.Vector3(col + 0.5, quadVertices[3], row + 0.5)
                            )
                        );
                    } else {
                        // backslash
                        this.tiles[row][col].triangles?.push(
                            new THREE.Triangle(
                                new THREE.Vector3(col - 0.5, quadVertices[0], row + 0.5),
                                new THREE.Vector3(col - 0.5, quadVertices[1], row - 0.5),
                                new THREE.Vector3(col + 0.5, quadVertices[2], row - 0.5)
                            )
                        );

                        this.tiles[row][col].triangles?.push(
                            new THREE.Triangle(
                                new THREE.Vector3(col - 0.5, quadVertices[0], row + 0.5),
                                new THREE.Vector3(col + 0.5, quadVertices[2], row - 0.5),
                                new THREE.Vector3(col + 0.5, quadVertices[3], row + 0.5)
                            )
                        );
                    }
                } else {
                    // flat or ramp
                    if (vertexSum === 2) {
                        // ramp
                        this.tiles[row][col].actualElevation = this.tiles[row][col].elevation + 0.5;
                    } else {
                        this.tiles[row][col].actualElevation = this.tiles[row][col].elevation + 0.0;
                    }
                    // use forward slash
                    this.tiles[row][col].triangles?.push(
                        new THREE.Triangle(
                            new THREE.Vector3(col - 0.5, quadVertices[0], row + 0.5),
                            new THREE.Vector3(col - 0.5, quadVertices[1], row - 0.5),
                            new THREE.Vector3(col + 0.5, quadVertices[3], row + 0.5)
                        )
                    );

                    this.tiles[row][col].triangles?.push(
                        new THREE.Triangle(
                            new THREE.Vector3(col - 0.5, quadVertices[1], row - 0.5),
                            new THREE.Vector3(col + 0.5, quadVertices[2], row - 0.5),
                            new THREE.Vector3(col + 0.5, quadVertices[3], row + 0.5)
                        )
                    );
                }
                // add vertices to buffer
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
