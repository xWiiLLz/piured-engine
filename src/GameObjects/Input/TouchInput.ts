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
import { TouchPad } from './TouchPad';
import * as THREE from 'three';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Engine } from '../../Engine';
import { FrameLog } from '../Sequence/SeqLog/FrameLog';
import { Pad } from './Pad';
import { Panels } from '../../Types/Panels';

export class TouchInput extends GameObject {
    private _mesh;
    private _scaled_mesh;
    private touchEvents: (Touch | null)[];

    pads: TouchPad[] = [];
    padsDic: Record<string, TouchPad>;

    constructor(
        resourceManager: ResourceManager,
        engine: Engine,
        public frameLog: FrameLog,
        private _noteskin: string
    ) {
        super(resourceManager, engine);

        // Connect to update lists, so it can be updated every frame and can keep track of key inputs.
        this.engine.addToTouchDownList(this);
        this.engine.addToTouchUpList(this);

        this.padsDic = {};
        // 15 fingers???
        this.touchEvents = [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
        ];

        this._mesh = new THREE.Object3D();
        this._scaled_mesh = new THREE.Object3D();
        this._scaled_mesh.add(this._mesh);
    }

    getPadIds() {
        return Object.keys(this.padsDic);
    }

    addTouchPad(padId: string) {
        const pad = new TouchPad(
            this._resourceManager,
            this.engine,
            padId,
            this.frameLog,
            this._noteskin
        );
        // pad.object.position.z = 0.05;
        // pad.object.position.y = -9;
        pad.object.scale.x = 4.0;
        pad.object.scale.y = 4.0;

        this._mesh.add(pad.object);

        this.pads.push(pad);
        this.padsDic[padId] = pad;

        this.adjustTouchPads();
    }

    adjustTouchPads() {
        const no_pads = this.pads.length;

        if (no_pads === 1) {
            return;
        }
        const distance = 8.1;

        let Xpos = -(distance * no_pads) / 2 + distance / 2;

        for (const pad of this.pads) {
            pad.object.position.x = Xpos;
            Xpos += distance;
        }
    }

    onTouchDown(event: TouchEvent) {
        const canvasPosition =
            this.engine.renderer?.domElement.getBoundingClientRect();
        if (!canvasPosition) return;

        for (let i = 0; i < event.touches.length; i++) {
            const touch = event.touches[i];

            if (this.touchEvents[touch.identifier] === null) continue;
            this.touchEvents[touch.identifier] = touch;
            const mouseX = touch.pageX - canvasPosition.left;
            const mouseY = touch.pageY - canvasPosition.top;

            for (const pad of this.pads) {
                const kinds = pad.touchDown(mouseX, mouseY);

                for (const kind of kinds) {
                    switch (kind) {
                        case 'dl':
                            pad.dlKeyPressed = true;
                            pad.dlKeyHold = true;
                            break;
                        case 'ul':
                            pad.ulKeyPressed = true;
                            pad.ulKeyHold = true;
                            break;
                        case 'c':
                            pad.cKeyPressed = true;
                            pad.cKeyHold = true;
                            break;
                        case 'ur':
                            pad.urKeyPressed = true;
                            pad.urKeyHold = true;
                            break;
                        case 'dr':
                            pad.drKeyPressed = true;
                            pad.drKeyHold = true;
                            break;
                    }
                }
            }
        }
    }

    onTouchUp(event: TouchEvent) {
        const canvasPosition =
            this.engine.renderer?.domElement.getBoundingClientRect();
        if (!canvasPosition) return;

        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = this.touchEvents[event.changedTouches[i].identifier];
            this.touchEvents[event.changedTouches[i].identifier] = null;
            if (!touch) continue;

            const mouseX = touch.pageX - canvasPosition.left;
            const mouseY = touch.pageY - canvasPosition.top;

            for (const pad of this.pads) {
                const kinds = pad.touchUp(mouseX, mouseY);

                for (let j = 0; j < kinds.length; j++) {
                    const kind = kinds[j];
                    switch (kind) {
                        case 'dl':
                            pad.dlKeyHold = false;
                            break;
                        case 'ul':
                            pad.ulKeyHold = false;
                            break;
                        case 'c':
                            pad.cKeyHold = false;
                            break;
                        case 'ur':
                            pad.urKeyHold = false;
                            break;
                        case 'dr':
                            pad.drKeyHold = false;
                            break;
                    }
                }
            }
        }
    }

    isPressed(kind: Panels, padId: string) {
        return this.padsDic[padId].isPressed(kind);
    }

    isHeld(kind: Panels, padId: string) {
        return this.padsDic[padId].isHeld(kind);
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

    setScale(scale: number) {
        this._mesh.scale.x *= scale;
        this._mesh.scale.y *= scale;
    }

    get object() {
        return this._scaled_mesh;
    }
}
