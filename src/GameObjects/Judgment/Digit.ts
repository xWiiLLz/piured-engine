import { GameObject } from '../GameObject.js';
import * as TWEEN from '@tweenjs/tween.js';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Engine } from '../../Engine';
import * as THREE from 'three';
import { Color } from 'three';

export class Digit extends GameObject {
    _mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    opacityFadeTween?: TWEEN.Tween<THREE.MeshBasicMaterial>;
    burnTween?: TWEEN.Tween<Color>;
    constructor(resourceManager: ResourceManager, engine: Engine) {
        super(resourceManager, engine);

        this._mesh = this._resourceManager.constructDigit();

        this._mesh.material.map?.repeat.set(1 / 4, 1 / 4);
        this._mesh.material.map?.offset.set(0, 3 / 4);

        this._mesh.material.opacity = 0.0;
    }

    animate() {
        if (this.opacityFadeTween) {
            TWEEN.remove(this.opacityFadeTween);
        }
        if (this.burnTween) {
            TWEEN.remove(this.burnTween);
        }

        const diffuseTimeWait = (30 / 60) * 1000;
        const diffuseAnimation = (22 / 60) * 1000;
        const time = (5 / 60) * 1000;
        this._mesh.material.opacity = 1.0;
        const scale = 100.0;

        this._mesh.material.color.r = 1.0;
        this._mesh.material.color.g = 1.0;
        this._mesh.material.color.b = 1.0;

        new TWEEN.Tween(this._mesh.material)
            .to({ opacity: 0.7 }, diffuseTimeWait)
            .start();

        this._mesh.material.opacity = 0.7;
        // we need to do this for each digit.
        this.opacityFadeTween = new TWEEN.Tween(this._mesh.material)
            .to({ opacity: 0.0 }, diffuseAnimation)
            .delay(diffuseTimeWait)
            .start();
        this.burnTween = new TWEEN.Tween(this._mesh.material.color)
            .to({ r: scale, g: scale, b: scale }, 1)
            .delay(diffuseTimeWait)
            .start();
    }

    displayDigit(digit: number) {
        const [row, col] = this.getCoordinatesForDigit(digit);
        // console.log(index) ;
        this._mesh.material.map?.offset.set(col * (1 / 4), row * (1 / 4));
    }

    hide() {
        this._mesh.material.map?.offset.set(1, 1);
    }

    getCoordinatesForDigit(digit: number): [number, number] {
        const col = digit % 4;
        const row = 3 - Math.floor(digit / 4);

        return [row, col];
    }

    get object() {
        return this._mesh;
    }
}
