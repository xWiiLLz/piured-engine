import { Curve } from './Curve.js';
import { Point } from './Point.js';
import { Interval } from './Interval.js';

export class Second2Beat {
    _curve: Curve;
    _bpms: number[][];

    constructor(bpms: number[][]) {
        const longFloat = 100000.0;
        this._bpms = Array.from(bpms);
        this._curve = new Curve();

        const l = Array.from(this._bpms[this._bpms.length - 1]);
        l[0] += longFloat;
        this._bpms.push(l);
        let prevPoint = new Point(0.0, 0.0);

        for (let i = 0; i < this._bpms.length - 1; i++) {
            const beat1 = this._bpms[i][0];
            const bpm1 = this._bpms[i][1];
            const beat2 = this._bpms[i + 1][0];
            const bpm2 = this._bpms[i + 1][1];

            const x = this.secondsPerBeat(bpm1) * (beat2 - beat1) + prevPoint.x;
            const y = beat2;
            const p = new Point(x, y);

            const interval = new Interval(
                prevPoint,
                p,
                i === 0,
                i === this._bpms.length - 2
            );

            this._curve.addInterval(interval);

            prevPoint = new Point(p.x, p.y);
        }
    }

    scry(value: number): Point {
        const p = new Point(value, 0);
        return this._curve.scryY(p);
    }

    reverseScry(value: number): Point {
        const p = new Point(0.0, value);
        return this._curve.scryX(p);
    }

    secondsPerBeat(bpm: number): number {
        return 1.0 / (bpm / 60.0);
    }
}
