import * as THREE from 'three';

export class ComboGeometry {
    // 138/36 because of the resolution of the image
    private _comboGeometry = new THREE.PlaneGeometry(138 / 36, 1, 1, 1);

    get comboGeometry() {
        return this._comboGeometry;
    }
}
