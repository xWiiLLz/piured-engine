import { GameObject } from '../GameObject.js';
import { Banner, Grade } from './Banner.js';
import { Combo } from './Combo.js';
import { Digits } from './Digits.js';
import * as THREE from 'three';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Engine } from '../../Engine';

export class Judgment extends GameObject {
    _banner: Banner;
    _combo: Combo;
    _whiteDigits: Digits;

    judgmentZDepth: number;
    _object: THREE.Object3D;
    private maxNumDigits: number;
    private comboYPosition: number;

    constructor(resourceManager: ResourceManager, engine: Engine) {
        super(resourceManager, engine);

        this.judgmentZDepth = 0.00002;
        this.maxNumDigits = 5;

        this._object = new THREE.Object3D();

        this._banner = new Banner(this._resourceManager, this.engine);
        this._banner.object.position.z = this.judgmentZDepth;
        this._object.add(this._banner.object);

        this._combo = new Combo(this._resourceManager, this.engine);
        this.comboYPosition = this._banner.object.position.y - 0.5;
        this._combo.object.position.z = this.judgmentZDepth;
        this._combo.object.position.y = this.comboYPosition;
        this._object.add(this._combo.object);

        this._whiteDigits = new Digits(
            this._resourceManager,
            this.engine,
            this.maxNumDigits
        );
        this._whiteDigits.object.position.z = this.judgmentZDepth;
        this._whiteDigits.object.position.y = this.comboYPosition - 0.35;
        this._object.add(this._whiteDigits.object);
    }

    ready() {
        this._banner.setGrade(Grade.perfect);
        this._whiteDigits.displayComboCount(0);
    }

    animate(grade: Grade, comboCount: number) {
        this._banner.animate();
        this._banner.setGrade(grade);

        if (comboCount > 3) {
            this._whiteDigits.displayComboCount(comboCount);
            this._combo.animate();
            this._whiteDigits.animate();
        }
    }

    get object() {
        return this._object;
    }
}
