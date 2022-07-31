import * as THREE from 'three';

export class DigitGeometry {
    // Due to texture dimensions, the object needs to have aspect ratio 60/80
    private _digitGeometry = new THREE.PlaneGeometry(60 / 80, 1, 1, 1);

    get digitGeometry() {
        return this._digitGeometry;
    }
}
