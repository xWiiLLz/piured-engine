import * as THREE from 'three';

export class TransparentMaterial {
    private _material: THREE.MeshBasicMaterial;

    constructor(map: THREE.Texture) {
        this._material = new THREE.MeshBasicMaterial({
            map,
            transparent: true,
        });

        this._material.alphaTest = 0.1;
    }

    get material() {
        return this._material;
    }
}
