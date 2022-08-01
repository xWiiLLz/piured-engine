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
'use strict'; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

import { PadConfig } from '@src/Config/KeyInputConfig';
import { Engine } from '@src/Engine';
import { ResourceManager } from '@src/Resources/ResourceManager';
import { Panels } from '@src/Types/Panels';
import { GameObject } from '../GameObject';
import { FrameLog } from '../Sequence/SeqLog/FrameLog';

export class Pad extends GameObject {
    private _dlKey?: string;
    private _ulKey?: string;
    private _cKey?: string;
    private _urKey?: string;
    private _drKey?: string;
    private _dlKeyPressed = false;
    private _ulKeyPressed = false;
    private _cKeyPressed = false;
    private _urKeyPressed = false;
    private _drKeyPressed = false;
    private _dlKeyHold = false;
    private _ulKeyHold = false;
    private _cKeyHold = false;
    private _urKeyHold = false;
    private _drKeyHold = false;

    constructor(
        resourceManager: ResourceManager,
        engine: Engine,
        keyMap: PadConfig | null,
        private _padId: string,
        public frameLog: FrameLog
    ) {
        super(resourceManager, engine);
        // Key maps
        this._dlKey = keyMap?.dl?.toLowerCase?.();
        this._ulKey = keyMap?.ul?.toLowerCase?.();
        this._cKey = keyMap?.c?.toLowerCase?.();
        this._urKey = keyMap?.ur?.toLowerCase?.();
        this._drKey = keyMap?.dr?.toLowerCase?.();
    }

    isPressed(kind: Panels) {
        switch (kind) {
            case Panels.downLeft:
                return this.dlKeyPressed;
                break;
            case Panels.upLeft:
                return this.ulKeyPressed;
                break;
            case Panels.center:
                return this.cKeyPressed;
                break;
            case Panels.upRight:
                return this.urKeyPressed;
                break;
            case Panels.downRight:
                return this.drKeyPressed;
                break;
        }
    }

    isHeld(kind: Panels) {
        switch (kind) {
            case Panels.downLeft:
                return this.dlKeyHold;
                break;
            case Panels.upLeft:
                return this.ulKeyHold;
                break;
            case Panels.center:
                return this.cKeyHold;
                break;
            case Panels.upRight:
                return this.urKeyHold;
                break;
            case Panels.downRight:
                return this.drKeyHold;
                break;
        }
    }

    ready() {
        // noop
    }

    update(delta: number) {
        // to avoid login every time
        if (this.dlKeyPressed !== false) {
            this.dlKeyPressed = false;
        }

        if (this.ulKeyPressed !== false) {
            this.ulKeyPressed = false;
        }

        if (this.cKeyPressed !== false) {
            this.cKeyPressed = false;
        }

        if (this.urKeyPressed !== false) {
            this.urKeyPressed = false;
        }

        if (this.drKeyPressed !== false) {
            this.drKeyPressed = false;
        }
    }

    get padId() {
        return this._padId;
    }

    set padId(value) {
        this._padId = value;
    }

    get dlKey() {
        return this._dlKey;
    }

    set dlKey(value) {
        this._dlKey = value;
    }

    get ulKey() {
        return this._ulKey;
    }

    set ulKey(value) {
        this._ulKey = value;
    }

    get cKey() {
        return this._cKey;
    }

    set cKey(value) {
        this._cKey = value;
    }

    get urKey() {
        return this._urKey;
    }

    set urKey(value) {
        this._urKey = value;
    }

    get drKey() {
        return this._drKey;
    }

    set drKey(value) {
        this._drKey = value;
    }

    get dlKeyPressed() {
        return this._dlKeyPressed;
    }

    set dlKeyPressed(value: boolean) {
        if (value === true) {
            this.frameLog.logPadInput(
                Panels.downLeft,
                this._padId,
                'pressed',
                value
            );
        }
        this._dlKeyPressed = value;
    }

    get ulKeyPressed() {
        return this._ulKeyPressed;
    }

    set ulKeyPressed(value: boolean) {
        if (value === true) {
            this.frameLog.logPadInput(
                Panels.upLeft,
                this._padId,
                'pressed',
                value
            );
        }
        this._ulKeyPressed = value;
    }

    get cKeyPressed() {
        return this._cKeyPressed;
    }

    set cKeyPressed(value: boolean) {
        if (value === true) {
            this.frameLog.logPadInput(
                Panels.center,
                this._padId,
                'pressed',
                value
            );
        }
        this._cKeyPressed = value;
    }

    get urKeyPressed() {
        return this._urKeyPressed;
    }

    set urKeyPressed(value: boolean) {
        if (value === true) {
            this.frameLog.logPadInput(
                Panels.upRight,
                this._padId,
                'pressed',
                value
            );
        }
        this._urKeyPressed = value;
    }

    get drKeyPressed() {
        return this._drKeyPressed;
    }

    set drKeyPressed(value: boolean) {
        if (value === true) {
            this.frameLog.logPadInput(
                Panels.downRight,
                this._padId,
                'pressed',
                value
            );
        }
        this._drKeyPressed = value;
    }

    get dlKeyHold() {
        return this._dlKeyHold;
    }

    set dlKeyHold(value: boolean) {
        this.frameLog.logPadInput(Panels.downLeft, this._padId, 'hold', value);
        this._dlKeyHold = value;
    }

    get ulKeyHold() {
        return this._ulKeyHold;
    }

    set ulKeyHold(value: boolean) {
        this.frameLog.logPadInput(Panels.upLeft, this._padId, 'hold', value);
        this._ulKeyHold = value;
    }

    get cKeyHold() {
        return this._cKeyHold;
    }

    set cKeyHold(value: boolean) {
        this.frameLog.logPadInput(Panels.center, this._padId, 'hold', value);
        this._cKeyHold = value;
    }

    get urKeyHold() {
        return this._urKeyHold;
    }

    set urKeyHold(value: boolean) {
        this.frameLog.logPadInput(Panels.upRight, this._padId, 'hold', value);
        this._urKeyHold = value;
    }

    get drKeyHold() {
        return this._drKeyHold;
    }

    set drKeyHold(value: boolean) {
        this.frameLog.logPadInput(Panels.downRight, this._padId, 'hold', value);
        this._drKeyHold = value;
    }
}
