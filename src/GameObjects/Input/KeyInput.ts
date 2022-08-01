/*
 * # Copyright (C) Pedro G. Bascoy
 # This file is part of piured-engine <https://github.com/piulin/piured-engine>.
 #
 # piured-engine is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # piured-engine is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with piured-engine.If not, see <http://www.gnu.org/licenses/>.
 *
 */

// This class is responsible for the input of a pad (5 steps)
import { GameObject } from '../GameObject';
import { Pad } from './Pad';
import * as THREE from 'three';
import { ResourceManager } from '@src/Resources/ResourceManager';
import { Engine } from '@src/Engine';
import { FrameLog } from '../Sequence/SeqLog/FrameLog';
import { PadConfig } from '@src/Config/KeyInputConfig';
import { Panels } from '@src/Types/Panels';

export class KeyInput extends GameObject {
    _mesh: THREE.Object3D;

    pads: Pad[] = [];
    padsDic: Record<string, Pad> = {};
    constructor(
        resourceManager: ResourceManager,
        engine: Engine,
        public frameLog: FrameLog
    ) {
        super(resourceManager, engine);

        // Connect to update lists, so it can be updated every frame and can keep track of key inputs.
        this.engine.addToKeyDownList(this);
        this.engine.addToKeyUpList(this);

        this._mesh = new THREE.Object3D();
    }

    getPadIds() {
        return Object.keys(this.padsDic);
    }

    addPad(keyMap: PadConfig, padId: string) {
        const pad = new Pad(
            this._resourceManager,
            this.engine,
            keyMap,
            padId,
            this.frameLog
        );
        this.pads.push(pad);
        this.padsDic[padId] = pad;
    }

    onKeyDown(event: KeyboardEvent) {
        const key = event.key.toLowerCase();

        for (const pad of this.pads) {
            if (key === pad.dlKey && !pad.dlKeyHold) {
                pad.dlKeyHold = true;
                pad.dlKeyPressed = true;
                // console.log('dl down: ' +key) ;
            } else if (key === pad.ulKey && !pad.ulKeyHold) {
                pad.ulKeyHold = true;
                pad.ulKeyPressed = true;
                // console.log('ul down : ' +key)
            } else if (key === pad.cKey && !pad.cKeyHold) {
                pad.cKeyHold = true;
                pad.cKeyPressed = true;
                // console.log('c down: ' +key)
            } else if (key === pad.urKey && !pad.urKeyHold) {
                pad.urKeyHold = true;
                pad.urKeyPressed = true;
                // console.log('ur down: ' +key)
            } else if (key === pad.drKey && !pad.drKeyHold) {
                pad.drKeyHold = true;
                pad.drKeyPressed = true;
                // console.log('dr down: ' +key)
            }
        }
    }

    onKeyUp(event: KeyboardEvent) {
        const key = event.key;

        for (const pad of this.pads) {
            if (key === pad.dlKey) {
                pad.dlKeyHold = false;
                // console.log('dl up: ' + key);
            } else if (key === pad.ulKey) {
                pad.ulKeyHold = false;
                // console.log('ul up: ' + key);
            } else if (key === pad.cKey) {
                pad.cKeyHold = false;
                // console.log('c up: ' + key);
            } else if (key === pad.urKey) {
                pad.urKeyHold = false;
                // console.log('ur up: ' + key);
            } else if (key === pad.drKey) {
                pad.drKeyHold = false;
                // console.log('dr up: ' + key);
            }
        }
    }

    isPressed(kind: Panels, padId: string) {
        return this.padsDic[padId].isPressed(kind);
    }

    isHeld(kind: Panels, padId: string) {
        return this.padsDic[padId].isHeld(kind);
    }

    ready() {
        // no-op
    }

    update(delta: number) {
        // no-op
    }

    getPressed() {
        const list = [];

        for (const pad of this.pads) {
            if (pad.dlKeyPressed) {
                list.push(['dl', pad.padId]);
            }

            if (pad.ulKeyPressed) {
                list.push(['ul', pad.padId]);
            }

            if (pad.cKeyPressed) {
                list.push(['c', pad.padId]);
            }

            if (pad.urKeyPressed) {
                list.push(['ur', pad.padId]);
            }

            if (pad.drKeyPressed) {
                list.push(['dr', pad.padId]);
            }
        }

        return list;
    }

    get object() {
        return this._mesh;
    }
}
