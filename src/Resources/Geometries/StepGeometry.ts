import * as THREE from 'three';

export class StepGeometry {
    // 1x1 square
    private _stepGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    get stepGeometry() {
        return this._stepGeometry;
    }
}
