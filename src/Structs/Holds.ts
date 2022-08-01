// Data structure that supports the StepQueue functionality

import { StepHold } from '../GameObjects/StepNotes/StepHold';
import { Panels } from '../Types/Panels';

// It holds at a given time, the current holds and their state.
export class Holds {
    // These five correspond to the holds steps (Object3D)
    private panels: {
        [key in Panels]: StepHold | null;
    } = {
        dl: null,
        ul: null,
        c: null,
        ur: null,
        dr: null,
    };

    constructor(public padId: string) {}

    setHold(kind: Panels, value: StepHold) {
        this.panels[kind] = value;
    }

    getHold(kind: Panels) {
        return this.panels[kind];
    }

    asList() {
        return Object.values(this.panels).filter(
            (hold): hold is StepHold => hold !== null
        );
    }

    get dl() {
        return this.panels.dl;
    }

    set dl(value) {
        this.panels.dl = value;
    }

    get ul() {
        return this.panels.ul;
    }

    set ul(value) {
        this.panels.ul = value;
    }

    get c() {
        return this.panels.c;
    }

    set c(value) {
        this.panels.c = value;
    }

    get ur() {
        return this.panels.ur;
    }

    set ur(value) {
        this.panels.ur = value;
    }

    get dr() {
        return this.panels.dr;
    }

    set dr(value) {
        this.panels.dr = value;
    }
}
