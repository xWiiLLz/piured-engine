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

import { Engine } from 'src/Engine';
import { ResourceManager } from 'src/Resources/ResourceManager';
import { Panels } from 'src/Types/Panels';
import { GameObject } from '../../GameObject';

type Step = {
    id: string;
};

export type PadInputAction = 'pressed' | 'hold';
export class FrameLog extends GameObject {
    _json: {
        removeSteps?: string[];
        padInput?: {
            kind: Panels;
            padId: string;
            action: PadInputAction;
            value: boolean;
        }[];
        receptorFX?: string[];
        judgment?: {
            grade: number;
            combo: number;
            step: unknown;
        };
    } = {};

    constructor(
        resourceManager: ResourceManager,
        engine: Engine,
        private _playerStageId: string
    ) {
        super(resourceManager, engine);
    }

    get playerStageId() {
        return this._playerStageId;
    }

    get json() {
        return this._json;
    }

    logAnimateReceptorFX(steplist: Step[]) {
        if (!('receptorFX' in this._json) || !this._json.receptorFX) {
            this._json['receptorFX'] = [];
        }
        const receptorFXList = this._json['receptorFX'];
        for (let i = 0; i < steplist.length; i++) {
            receptorFXList.push(steplist[i].id);
        }
    }

    logJudgment(grade: number, combo: number, step: unknown) {
        this._json.judgment = {
            grade,
            combo,
            step,
        };
    }

    logRemoveStep(step: Step) {
        if (!('removeSteps' in this._json) || !this._json.removeSteps) {
            this._json.removeSteps = [];
        }
        this._json.removeSteps.push(step.id);
    }

    logPadInput(
        kind: Panels,
        padId: string,
        action: PadInputAction,
        value: boolean
    ) {
        if (!('padInput' in this._json) || !this._json.padInput) {
            this._json.padInput = [];
        }

        this._json.padInput.push({
            kind,
            padId,
            action,
            value,
        });
    }

    ready() {
        // noop
    }

    update(delta: number) {
        if (Object.keys(this._json).length !== 0) {
            this.engine.addToOutputFrameLogList(this);
        }

        // if ( Object.keys(this._json).length !== 0 && this._hadIlogged === false ) {
        //     engine.addToOutputFrameLogList(this) ;
        //     this._hadIlogged = true ;
        // }
        //
        // if(this._hadIlogged) {
        //     engine.addToOutputFrameLogList(this) ;
        // }

        this._json = {};
    }
}
