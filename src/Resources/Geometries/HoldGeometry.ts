import * as THREE from 'three';

export class HoldGeometry {
    get holdGeometry() {
        /**
         * We cannot reuse the same geometry, have to create one every time.
         */
        return new THREE.PlaneGeometry(1, 1, 1, 1);
    }
}
