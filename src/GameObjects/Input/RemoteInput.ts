'use strict'; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

// This class is responsible for the input of a pad (5 steps)
import { GameObject } from '../GameObject';
import * as THREE from 'three';
import { RemotePad } from './RemotePad';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Engine } from '../../Engine';
import { Panels } from '../../Types/Panels';
import { FrameLogDto, PadInputAction } from '../Sequence/SeqLog/FrameLog';

export class RemoteInput extends GameObject {
    private _mesh: THREE.Object3D;
    pads: RemotePad[];
    padsDic: Record<string, RemotePad> = {};

    constructor(resourceManager: ResourceManager, engine: Engine) {
        super(resourceManager, engine);

        this.pads = [];
        this.padsDic = {};

        this._mesh = new THREE.Object3D();
    }

    getPadIds() {
        return Object.keys(this.padsDic);
    }

    addPad(padId: string) {
        const pad = new RemotePad(this._resourceManager, this.engine, padId);
        this.pads.push(pad);
        this.padsDic[padId] = pad;
    }

    isPressed(kind: Panels, padId: string) {
        return this.padsDic[padId].isPressed(kind);
    }

    isHeld(kind: Panels, padId: string) {
        return this.padsDic[padId].isHeld(kind);
    }

    getPressed() {
        const list: [Panel: Panels, PadId: string][] = [];

        for (const pad of this.pads) {
            if (pad.dlKeyPressed) {
                list.push([Panels.downLeft, pad.padId]);
            }

            if (pad.ulKeyPressed) {
                list.push([Panels.upLeft, pad.padId]);
            }

            if (pad.cKeyPressed) {
                list.push([Panels.center, pad.padId]);
            }

            if (pad.urKeyPressed) {
                list.push([Panels.upRight, pad.padId]);
            }

            if (pad.drKeyPressed) {
                list.push([Panels.downRight, pad.padId]);
            }
        }

        return list;
    }

    applyFrameLog(json: FrameLogDto) {
        if (json.padInput) {
            for (const { kind, padId, action, value } of json.padInput) {
                this.processFrameLogPadInput(kind, padId, action, value);
            }
        }
    }

    processFrameLogPadInput(
        kind: Panels,
        padId: string,
        action: PadInputAction,
        value: boolean
    ) {
        switch (kind) {
            case 'dl':
                if (action === 'pressed') {
                    this.padsDic[padId].dlKeyPressed = value;
                } else {
                    this.padsDic[padId].dlKeyHold = value;
                }
                break;
            case 'ul':
                if (action === 'pressed') {
                    this.padsDic[padId].ulKeyPressed = value;
                } else {
                    this.padsDic[padId].ulKeyHold = value;
                }
                break;
            case 'c':
                if (action === 'pressed') {
                    this.padsDic[padId].cKeyPressed = value;
                } else {
                    this.padsDic[padId].cKeyHold = value;
                }
                break;
            case 'ur':
                if (action === 'pressed') {
                    this.padsDic[padId].urKeyPressed = value;
                } else {
                    this.padsDic[padId].urKeyHold = value;
                }
                break;
            case 'dr':
                if (action === 'pressed') {
                    this.padsDic[padId].drKeyPressed = value;
                } else {
                    this.padsDic[padId].drKeyHold = value;
                }
                break;
        }
    }

    get object() {
        return this._mesh;
    }
}
