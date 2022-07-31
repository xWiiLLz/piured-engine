import * as THREE from 'three';

export class TipGeometry {
    // 60x100
    private _geometry = new THREE.PlaneGeometry(
        0.6 * (68 / 194),
        68 / 194,
        1,
        1
    );

    get tipGeometry() {
        return this._geometry;
    }
}
