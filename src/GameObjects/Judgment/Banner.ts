import { GameObject } from '../GameObject.js';
import * as TWEEN from '@tweenjs/tween.js';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Engine } from '../../Engine';
import { Color, Vector3 } from 'three';

export enum Grade {
    perfect = 'p',
    great = 'gr',
    good = 'go',
    bad = 'b',
    miss = 'm',
}

export class Banner extends GameObject {
    _mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    scaleFadeTween?: TWEEN.Tween<Vector3>;
    opacityFadeTween?: TWEEN.Tween<THREE.MeshBasicMaterial>;
    burnTween?: TWEEN.Tween<Color>;
    constructor(resourceManager: ResourceManager, engine: Engine) {
        super(resourceManager, engine);

        this._mesh = this._resourceManager.constructJudgmentBanner();

        // 0.6
        this._mesh.material.map?.repeat.set(1, 1 / 6);
        this._mesh.material.map?.offset.set(0, 0);
        this._mesh.scale.set(0.6, 0.6, 1);
        this._mesh.material.opacity = 0.0;
    }

    animate() {
        // remove scheduled tweens
        if (this.scaleFadeTween) {
            TWEEN.remove(this.scaleFadeTween);
        }
        if (this.opacityFadeTween) {
            TWEEN.remove(this.opacityFadeTween);
        }
        if (this.burnTween) {
            TWEEN.remove(this.burnTween);
        }

        const diffuseTimeWait = (30 / 60) * 1000;
        const diffuseAnimation = (22 / 60) * 1000;
        const time = (4.5 / 60) * 1000;

        // schedule going out tweens for JUDGMENT
        this._mesh.material.opacity = 1.0;

        this._mesh.material.color.r = 1.0;
        this._mesh.material.color.g = 1.0;
        this._mesh.material.color.b = 1.0;
        // this._mesh.material.combine = THREE.AddOperation ;
        // this._mesh.material.lightMapIntensity = 5.0 ;
        this._mesh.scale.set(0.6, 0.6, 1.0);

        new TWEEN.Tween(this._mesh.material)
            .to({ opacity: 0.7 }, diffuseTimeWait)
            .start();

        this._mesh.material.opacity = 0.7;
        this.scaleFadeTween = new TWEEN.Tween(this._mesh.scale)
            .to({ x: 1.5, y: 0.0 }, diffuseAnimation)
            .delay(diffuseTimeWait)
            .start();
        this.opacityFadeTween = new TWEEN.Tween(this._mesh.material)
            .to({ opacity: 0.0 }, diffuseAnimation)
            .delay(diffuseTimeWait)
            .start();
        this.burnTween = new TWEEN.Tween(this._mesh.material.color)
            .to({ r: 10, g: 10, b: 2 }, 1)
            .delay(diffuseTimeWait)
            .start();

        this._mesh.scale.set(0.87, 0.87, 1.0);
        this._mesh.material.opacity = 1.0;
        this._mesh.position.y = this._mesh.scale.y / 5;

        //
        new TWEEN.Tween(this._mesh.scale).to({ x: 0.6, y: 0.6 }, time).start();
        new TWEEN.Tween(this._mesh.position).to({ y: 0 }, time).start();
    }

    setGrade(grade: Grade) {
        switch (grade) {
            case Grade.perfect:
                this._mesh.material.map?.offset.set(0, 5 / 6);
                break;
            case Grade.great:
                this._mesh.material.map?.offset.set(0, 4 / 6);
                break;
            case Grade.good:
                this._mesh.material.map?.offset.set(0, 2 / 6);
                break;
            case Grade.bad:
                this._mesh.material.map?.offset.set(0, 1 / 6);
                break;
            case Grade.miss:
                this._mesh.material.map?.offset.set(0, 0);
                break;
        }
    }

    get object() {
        return this._mesh;
    }
}
