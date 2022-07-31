import * as THREE from 'three';

export class JudgmentGeometry {
    // 6x1 rectangle
    private _judgmentGeometry = new THREE.PlaneGeometry(6, 1, 1, 1);

    get judgmentGeometry() {
        return this._judgmentGeometry;
    }
}
