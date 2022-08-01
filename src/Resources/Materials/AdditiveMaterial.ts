import * as THREE from 'three';

export class AdditiveMaterial {
    private _material: THREE.MeshBasicMaterial;

    constructor(map: THREE.Texture) {
        this._material = new THREE.MeshBasicMaterial({
            map,
            transparent: true,
        });

        this._material.alphaTest = 0.1;

        this._material.blending = THREE.AdditiveBlending;
        this._material.depthWrite = false;
    }

    get material() {
        return this._material;
    }
}
