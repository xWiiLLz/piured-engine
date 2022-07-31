import * as THREE from 'three';

export class PulseGeometry {
    // 2x1 rectangle
    _size = 0.4;
    private _geometry = new THREE.PlaneGeometry(this._size, 68 / 194, 1, 1);

    get pulseGeometry() {
        return this._geometry;
    }
}
