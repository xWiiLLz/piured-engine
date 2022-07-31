import * as THREE from 'three';

export class ReceptorGeometry {
    // 5x1 rectangle
    private _receptorGeometry = new THREE.PlaneGeometry(5, 1, 1, 1);

    get receptorGeometry() {
        return this._receptorGeometry;
    }
}
