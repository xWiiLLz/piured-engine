import * as THREE from 'three';

export class DLifeBarGeometry {
    // 5x1 rectangle
    private _geometry = new THREE.PlaneGeometry(8, 68 / 194, 1, 1);

    get lifeBarGeometry() {
        return this._geometry;
    }
}
