import { Engine } from '../../../Engine';
import { ResourceManager } from '../../../Resources/ResourceManager';
import { Panels } from '../../../Types/Panels';
import { GameObject } from '../../GameObject';

type Step = {
    id: string;
};

export type FrameLogDto = {
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
};

export type PadInputAction = 'pressed' | 'hold';
export class FrameLog extends GameObject {
    _json: FrameLogDto = {};

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
