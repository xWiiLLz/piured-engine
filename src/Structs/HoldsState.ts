// Data structure that supports the StepQueue functionality
// It holds at a given time, the current holds and their state.
import { StepHold } from 'src/GameObjects/StepNotes/StepHold.js';
import { Panels } from 'src/Types/Panels.js';
import { Holds } from './Holds.js';

export class HoldsState {
    holdsDict: Record<string, Holds>;
    cumulatedHoldTime: number;
    needFinishJudgment: boolean;
    judgmentTimeStampEndReference: number;
    timeCounterJudgmentHolds: number;
    wasLastKnowHoldPressed: boolean;
    beginningHoldChunk: boolean;
    lastAddedHold: null;
    holdRun: boolean;
    firstHoldInHoldRun: null;

    constructor(padIds: string[]) {
        //We need one holds instance for each pad.
        this.holdsDict = {};
        for (const id of padIds) {
            const holds = new Holds(id);
            this.holdsDict[id] = holds;
        }

        // All these values are directly updated by the StepQueue

        // This stores the amount of time that a hold has been run (pressed or not).
        // It is used to calculate the remainder steps to add to the judgment.
        this.cumulatedHoldTime = 0.0;

        // This flag states whether a judgment is needed after the hold has reached the end
        this.needFinishJudgment = false;

        // it holds the elapsed time between the first and last hold in the hold run (sequence).
        this.judgmentTimeStampEndReference = 0.0;

        // It keeps the time elapsed between frames in order to judge a hold.
        this.timeCounterJudgmentHolds = 0.0;

        // It states whether the hold was pressed until the end.
        this.wasLastKnowHoldPressed = true;

        //
        this.beginningHoldChunk = false;

        // Keeps track of the last Hold added
        this.lastAddedHold = null;

        // States if we are currently in a hold run
        this.holdRun = false;

        // Keeps the first hold Object3D of the hold run
        this.firstHoldInHoldRun = null;
    }

    setHold(kind: Panels, padId: string, value: StepHold) {
        // console.log(padId);
        this.holdsDict[padId].setHold(kind, value);
    }

    getHold(kind: Panels, padId: string) {
        return this.holdsDict[padId].getHold(kind);
    }

    get holds(): readonly Holds[] {
        return Object.values(this.holdsDict);
    }

    asList() {
        return this.holds.flatMap((hold) => hold.asList());
    }
}
