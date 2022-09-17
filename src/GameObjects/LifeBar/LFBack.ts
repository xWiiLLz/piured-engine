import { GameObject } from '../GameObject.js';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Engine } from '../../Engine';

export class LFBack extends GameObject {
    _mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

    constructor(
        resourceManager: ResourceManager,
        engine: Engine,
        kind: string
    ) {
        super(resourceManager, engine);

        if (kind === 'single') {
            this._mesh = this._resourceManager.constructSLifeBarBack();
        } else {
            this._mesh = this._resourceManager.constructDLifeBarBack();
        }

        this._mesh.material.map?.repeat.set(1, 1 / 2);
        this._mesh.material.map?.offset.set(0, 1 / 2);

        // this._tweenOpacityEffect = undefined ;
    }

    normal() {
        this._mesh.material.map?.offset.set(0, 1 / 2);
    }

    red() {
        this._mesh.material.map?.offset.set(0, 0);
    }

    get object() {
        return this._mesh;
    }
}
