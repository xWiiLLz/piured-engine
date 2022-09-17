import { GameObject } from '../GameObject.js';
import { LFBarFX } from './LFBarFX.js';
import { LFBarFXRed } from './LFBarFXRed.js';
import { LFPulse } from './LFPulse.js';
import { LFTip } from './LFTip.js';
import * as THREE from 'three';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Engine } from '../../Engine';
import { BeatManager } from '../BeatManager/BeatManager';

export class LFBar extends GameObject {
    _barFX: LFBarFX;
    _barFXRed: LFBarFXRed;
    _bar: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    _pulse: LFPulse;
    _tip: LFTip;
    _object: THREE.Object3D;
    kind: string;
    private pulseXSize: number;
    private pulseXHalfSize: number;
    private barXSize: number;
    private barXHalfSize: number;

    constructor(
        resourceManager: ResourceManager,
        engine: Engine,
        beatManager: BeatManager,
        kind: string
    ) {
        super(resourceManager, engine);

        this._object = new THREE.Object3D();

        this.kind = kind;

        this._barFX = new LFBarFX(this._resourceManager, this.engine, kind);
        this._barFXRed = new LFBarFXRed(
            this._resourceManager,
            this.engine,
            beatManager,
            kind
        );
        this._pulse = new LFPulse(
            this._resourceManager,
            this.engine,
            beatManager,
            kind
        );
        this._tip = new LFTip(this._resourceManager, this.engine);

        this.pulseXSize = this._pulse.size;
        this.pulseXHalfSize = this.pulseXSize / 2;
        this.barXSize = 4;
        this.barXHalfSize = this.barXSize / 2;

        if (kind === 'single') {
            this._bar = this._resourceManager.constructSLifeBarBar();
        } else {
            this.barXSize = 8;
            this.barXHalfSize = this.barXSize / 2;
            this._bar = this._resourceManager.constructDLifeBarBar();
        }

        this._bar.scale.y = 0.7;
        this._bar.material.map?.repeat.set(-1, 1 / 2);
        this._bar.material.map?.offset.set(0, 1 / 2);

        this._object.add(this._bar);
        this._object.add(this._pulse.object);
        this._object.add(this._tip.object);
        this._object.add(this._barFX.object);
        this._object.add(this._barFXRed.object);

        // this._tweenOpacityEffect = undefined ;
    }

    setsize(size) {
        if (size < 0.3) {
            this._barFXRed.blink = true;
            this._tip.red();
        } else {
            this._tip.blue();
            this._barFXRed.blink = false;
        }

        if (size < 0.02) {
            this.setsize(0.02);
            return;
        }

        if (size >= 1.0) {
            this._bar.position.x = 0;
            this._bar.scale.x = 1;
            this._bar.material.map.repeat.set(-1, 1 / 2);
            this._pulse.opacity = 0.0;
            if (this.kind === 'single') {
                this._tip.object.position.x = 1.92;
            } else {
                this._tip.object.position.x = 3.84;
            }
            // this._bar.material.opacity = 0.8 ;
            this._barFX.blink = true;
        } else {
            // this._bar.material.opacity = 1.0 ;
            this._pulse.opacity = 1.0;
            this._bar.material.map.repeat.set(-size, 1 / 2);
            this._bar.position.x =
                -(this.barXHalfSize - this.barXSize * (size / 2)) -
                this.pulseXHalfSize;

            this._bar.scale.x =
                (size * (this.barXSize * size - this.pulseXSize)) /
                (this.barXSize * size);

            if (this._bar.scale.x < 0) {
                this._bar.scale.x = 0;
            }

            this._pulse.object.position.x =
                -this.barXHalfSize +
                size * this.barXSize +
                this.pulseXSize / 2 -
                this.pulseXSize;

            if (
                this._pulse.object.position.x <
                -this.barXHalfSize + this.pulseXSize / 2
            ) {
                const diff =
                    this._pulse.object.position.x -
                    (-this.barXHalfSize + this.pulseXSize / 2);
                const newsize = this.pulseXSize + diff;

                this._pulse.object.scale.x = newsize / this.pulseXSize;
                // console.log(diff) ;

                this._pulse.object.position.x =
                    -this.barXHalfSize + newsize / 2;
            } else {
                this._pulse.object.scale.x = 1;
            }

            this._tip.object.position.x =
                -this.barXHalfSize + this.barXSize * size;
            this._barFX.blink = false;
        }
    }

    ready() {
        this._bar.position.z = 0.0;
        this._barFX.object.position.z = 0.001;
        this._pulse.object.position.z = 0.001;
        this._tip.object.position.z = 0.031;

        this._tip.object.scale.x = 1.6;
        this._tip.object.scale.y = 1.6;

        this._barFX.object.scale.x = 1.02;
        this._barFX.object.scale.y = 1.8;
        this._barFX.object.material.map.repeat.x = -1;

        this._barFXRed.object.scale.x = 1.02;
        this._barFXRed.object.scale.y = 1.8;
    }

    animate() {}

    update(delta) {}

    get object() {
        return this._object;
    }
}
