import { Point } from './Point.js';
import { Curve } from './Curve.js';
import { Interval } from './Interval.js';
import { Second2Beat } from './Second2Beat';

export class Beat2Speed {
    _curve: Curve;
    _speeds: number[][];
    _beat2s: number[] = [];
    _s2b: Second2Beat;

    constructor(speeds: number[][], s2b: Second2Beat) {
        this._s2b = s2b;
        this._speeds = Array.from(speeds);
        this._curve = new Curve();

        this.cleanUp();

        const longFloat = 1000000.0;

        let prevPoint = new Point(-longFloat, this._speeds[0][1]);

        for (let i = 0; i < this._speeds.length; i++) {
            const [beat, speed, span, mode] = this._speeds[i];

            //flat interval

            const f1 = new Point(prevPoint.x, prevPoint.y);
            const f2 = new Point(beat, prevPoint.y);

            const fInterval = new Interval(f1, f2, i === 0, false);
            this._curve.addInterval(fInterval);

            let beat2;
            // convert span in seconds into beats if mode is 1.
            if (mode === 1) {
                let sec = s2b.reverseScry(beat).x;
                sec = sec + span;
                beat2 = s2b.scry(sec).y;
            } else {
                beat2 = beat + span;
            }

            //slope (change of speed) interval

            const p1 = new Point(beat, prevPoint.y);
            const p2 = new Point(beat2, speed);

            const interval = new Interval(p1, p2, false, false);

            this._curve.addInterval(interval);

            prevPoint = p2;
        }
        //flat area
        const f1 = new Point(prevPoint.x, prevPoint.y);
        const f2 = new Point(longFloat, prevPoint.y);

        const fInterval = new Interval(f1, f2, false, true);
        this._curve.addInterval(fInterval);
    }

    cleanUp(): void {
        for (let i = 0; i < this._speeds.length - 1; i++) {
            const [beat, speed, span, mode] = this._speeds[i];
            const [nbeat, nspeed, nspan, nmode] = this._speeds[i + 1];

            const beat2 = this.getBeat2(mode, beat, span);

            if (beat2 > nbeat) {
                this._speeds[i][2] = nbeat - beat;
                this._speeds[i][3] = 0;
            }

            this._beat2s.push(this._speeds[i][2]);
        }
    }

    getBeat2(mode: number, beat: number, span: number) {
        if (mode === 1) {
            let sec = this._s2b.reverseScry(beat).x;
            sec = sec + span;
            return this._s2b.scry(sec).y;
        } else {
            return beat + span;
        }
    }

    scry(beat: number) {
        const p = new Point(beat, 0);
        return this._curve.scryY(p);
    }
}
