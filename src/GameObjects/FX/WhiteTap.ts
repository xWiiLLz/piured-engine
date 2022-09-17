'use strict'; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

import { GameObject } from '../GameObject.js';
import * as TWEEN from '@tweenjs/tween.js';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Panels } from '../../Types/Panels';
import { Engine } from '../../Engine';

export class WhiteTap extends GameObject {
    _mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    _kind: Panels;
    _tweenOpacityEffect?: any;

    constructor(
        resourceManager: ResourceManager,
        engine: Engine,
        kind: Panels,
        noteskin: string
    ) {
        super(resourceManager, engine);
        this._kind = kind;
        // this._mesh = this._resourceManager.constructGenericTap( ) ;

        // Create one step out of the five available.
        const tap = this._resourceManager.constructGenericWhiteTap(noteskin);
        tap.material.map?.repeat.set(1 / 5, 1 / 2);

        switch (kind) {
            case 'dl':
                tap.material.map?.offset.set(0, 1 / 2);
                break;
            case 'ul':
                tap.material.map?.offset.set(1 / 5, 1 / 2);
                break;
            case 'c':
                tap.material.map?.offset.set(2 / 5, 1 / 2);
                break;
            case 'ur':
                tap.material.map?.offset.set(3 / 5, 1 / 2);
                break;
            case 'dr':
                tap.material.map?.offset.set(4 / 5, 1 / 2);
                break;
        }

        this._mesh = tap;

        this._tweenOpacityEffect = undefined;
    }

    animate() {
        const time = 250;
        const opacityDelay = 100;
        this._mesh.material.opacity = 1.0;
        this._mesh.scale.set(1, 1, 1);

        if (this._tweenOpacityEffect) {
            TWEEN.remove(this._tweenOpacityEffect);
        }

        this._tweenOpacityEffect = new TWEEN.Tween(this._mesh.material)
            .to({ opacity: 0 }, time - opacityDelay)
            .delay(opacityDelay)
            .start();
        new TWEEN.Tween(this._mesh.scale).to({ x: 1.2, y: 1.2 }, time).start();
    }

    get object() {
        return this._mesh;
    }
}
