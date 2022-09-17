import { GameObject } from '../GameObject.js';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Engine } from '../../Engine';
import { Color, Vector3 } from 'three';

export class Combo extends GameObject {
    _mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    _object: THREE.Object3D;
    scaleFadeTween?: TWEEN.Tween<Vector3>;
    opacityFadeTween?: TWEEN.Tween<THREE.MeshBasicMaterial>;
    burnTween?: TWEEN.Tween<Color>;

    constructor(resourceManager: ResourceManager, engine: Engine) {
        super(resourceManager, engine);

        this._mesh = this._resourceManager.constructCombo();

        this._mesh.material.map?.repeat.set(1, 1 / 2);
        this._mesh.material.map?.offset.set(0, 1 / 2);

        this._mesh.scale.set(0.37, 0.37, 1.0);
        this._mesh.material.opacity = 0.0;

        this._object = new THREE.Object3D();
        this.object.add(this._mesh);
        //
    }

    animate() {
        const diffuseTimeWait = (30 / 60) * 1000;
        const diffuseAnimation = (22 / 60) * 1000;
        const time = (4.5 / 60) * 1000;

        if (this.scaleFadeTween) {
            TWEEN.remove(this.scaleFadeTween);
        }
        if (this.opacityFadeTween) {
            TWEEN.remove(this.opacityFadeTween);
        }
        if (this.burnTween) {
            TWEEN.remove(this.burnTween);
        }
        const scale = 100.0;
        this._mesh.material.color.r = 1.0;
        this._mesh.material.color.g = 1.0;
        this._mesh.material.color.b = 1.0;

        // similarly we update the tweens for the combo label
        this._mesh.material.opacity = 1.0;
        this._mesh.scale.set(0.37, 0.37, 1.0);
        this.scaleFadeTween = new TWEEN.Tween(this._mesh.scale)
            .to(
                {
                    x: 0.97,
                    y: 0.0,
                },
                diffuseAnimation
            )
            .delay(diffuseTimeWait)
            .start();

        new TWEEN.Tween(this._mesh.material)
            .to({ opacity: 0.7 }, diffuseTimeWait)
            .start();
        this.burnTween = new TWEEN.Tween(this._mesh.material.color)
            .to({ r: scale, g: scale, b: scale }, 1)
            .delay(diffuseTimeWait)
            .start();

        this._mesh.material.opacity = 0.7;

        this.opacityFadeTween = new TWEEN.Tween(this._mesh.material)
            .to({ opacity: 0.0 }, diffuseAnimation)
            .delay(diffuseTimeWait)
            .start();

        this._mesh.scale.set(0.58, 0.63, 1.0);
        this._mesh.material.opacity = 1.0;
        // this._mesh.position.y = - this._mesh.scale.y / 6;

        new TWEEN.Tween(this._mesh.scale)
            .to({ x: 0.37, y: 0.37 }, time)
            .start();
        new TWEEN.Tween(this._mesh.position).to({ y: 0 }, time).start();
    }

    get object() {
        return this._object;
    }
}
