import { GameObject } from '../GameObject.js';
import { Digit } from './Digit.js';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Engine } from '../../Engine';

export class Digits extends GameObject {
    _whiteDigits: THREE.Object3D;
    _whiteDigitsObjects: Digit[] = [];
    _object: THREE.Object3D;
    maxNumDigits: number;
    XscaleDigits: number;
    XsizeDigits: number;
    opacityFadeTween?: TWEEN.Tween<THREE.MeshBasicMaterial>;
    constructor(
        resourceManager: ResourceManager,
        engine: Engine,
        maxNumDigits: number
    ) {
        super(resourceManager, engine);

        this.maxNumDigits = maxNumDigits;

        this._whiteDigits = new THREE.Object3D();
        this._object = new THREE.Object3D();

        this.XscaleDigits = 0.85;
        this.XsizeDigits = 60 / 80;
        // Load <count> number of digits into the arrays; one for each color
        for (let i = 0; i < this.maxNumDigits; i++) {
            const normal = new Digit(this._resourceManager, this.engine);

            // place them into position
            normal.object.scale.set(this.XscaleDigits, this.XscaleDigits, 1.0);
            normal.object.position.x =
                i * this.XsizeDigits * normal.object.scale.x;
            this._whiteDigitsObjects.push(normal);
            this._whiteDigits.add(normal.object);
        }

        this._object.add(this._whiteDigits);

        this._whiteDigits.position.x -=
            ((this.maxNumDigits - 1) * this.XsizeDigits * this.XscaleDigits) /
            2;
    }

    animate() {
        const diffuseTimeWait = (30 / 60) * 1000;
        const diffuseAnimation = (22 / 60) * 1000;
        const time = (4.5 / 60) * 1000;

        if (this.opacityFadeTween) {
            TWEEN.remove(this.opacityFadeTween);
        }

        for (const digit of this._whiteDigitsObjects) {
            digit.animate();
        }
        this._object.scale.x = 1.05;
        this._object.scale.y = 1.05;
        this._whiteDigits.position.y = -0.17;
        new TWEEN.Tween(this._whiteDigits.position).to({ y: 0 }, time).start();
        new TWEEN.Tween(this._object.scale)
            .to({ y: 1.0, x: 1.0 }, time)
            .start();
    }

    displayComboCount(currentCombo: number) {
        const digitsInCount = currentCombo.toString().length;
        const neededDigits = digitsInCount > 3 ? digitsInCount : 3;
        const difference = this.maxNumDigits - neededDigits;

        // update position of numbers
        this._whiteDigits.position.x = 0;
        this._whiteDigits.position.x -=
            ((neededDigits - 1) * this.XsizeDigits * this.XscaleDigits) / 2 +
            difference * this.XsizeDigits * this.XscaleDigits;

        for (let i = 0; i < neededDigits; i++) {
            const index = this._whiteDigitsObjects.length - i - 1;
            const digit = this._whiteDigitsObjects[index];
            // make sure we show this digits
            const digitValue = Math.floor(
                (currentCombo / Math.pow(10, i)) % 10
            ); // 2

            digit.displayDigit(digitValue);
        }

        // do not show the remainder digits, using an offset out of the range.
        for (let i = neededDigits; i < this._whiteDigitsObjects.length; i++) {
            const index = this._whiteDigitsObjects.length - i - 1;
            const digit = this._whiteDigitsObjects[index];
            digit.hide();
        }
    }

    getCoordinatesForDigit(digit: number): [number, number] {
        const col = digit % 4;
        const row = 3 - Math.floor(digit / 4);

        return [row, col];
    }

    get object() {
        return this._object;
    }
}
