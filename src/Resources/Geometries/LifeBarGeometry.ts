import * as THREE from 'three';

export class LifeBarGeometry {
    // 5x1 rectangle
    private _geometry = new THREE.PlaneGeometry(4, 68 / 194, 1, 1);

    get lifeBarGeometry() {
        return this._geometry;
    }
}
