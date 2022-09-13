import { Point } from './Point.js';
import { Curve } from './Curve.js';
import { Interval } from './Interval.js';
import {Second2Beat} from "./Second2Beat";

class SongTime2Second {
    _curve: Curve;
    _stops: number[][];
    _delays: number[][];
    _warps: number[][];
    _s2b: Second2Beat;
    _eps: number = 0.000001;
    constructor(stops: number[][], delays: number[][], warps: number[][], s2b: Second2Beat) {
        this._s2b = s2b;
        let longFloat = 100000.0;

        //TODO: do we need this?
        this._stops = stops ? Array.from(stops) : [];
        this._delays = delays ? Array.from(delays) : [];
        this._warps = warps ? Array.from(warps) : [];
        this._curve = new Curve();
        this._curve.addInterval(
            new Interval(
                new Point(0.0, 0.0),
                new Point(longFloat, longFloat),
                true,
                true
            )
        );

        // warps
        for (let i = 0; i < this._warps.length; i++) {
            let b1 = this._warps[i][0];
            let span = this._warps[i][1];

            this.raise(b1, b1 + span);
        }

        // stops
        for (let i = 0; i < this._stops.length; i++) {
            let beat = this._stops[i][0];
            let span = this._stops[i][1];

            this.flatten(beat, span, this._eps);
        }

        //delays
        for (let i = 0; i < this._delays.length; i++) {
            let beat = this._delays[i][0];
            let span = this._delays[i][1];

            this.flatten(beat, span, -this._eps);
        }
    }

    flatten(beat: number, span: number, eps: number): void {
        let y1 = this._s2b.reverseScry(beat + eps).x;
        let x1 = this._curve.scryX(new Point(0.0, y1)).x;
        let x2 = x1 + span;
        // let y2 = this._curve.scryY(new Point(x2,0.0)).y ;

        let i1 = this._curve.findIntervalAtY(y1);
        let itvlIndex = this._curve.splitIntervalAtY(i1, y1);

        let flatItvl = new Interval(
            new Point(x1, y1),
            new Point(x2, y1),
            false,
            false
        );

        this._curve.addIntervalAtIndex(itvlIndex + 1, flatItvl);

        let remainderIntervals = this._curve.getIntervalsFromIndex(
            itvlIndex + 2
        );

        let diff = x2 - x1;

        for (let j = 0; j < remainderIntervals.length; j++) {
            let itvl = remainderIntervals[j];
            itvl.p1.x += diff;
            itvl.p2.x += diff;
        }
    }

    raise(b1, b2) {
        let y1 = this._s2b.reverseScry(b1).x;
        let y2 = this._s2b.reverseScry(b2).x;

        console.log(y1, y2);

        // let x1 = this._curve.scryX(new Point(0.0,y1)).x ;
        // let x2 = this._curve.scryX(new Point(0.0,y2)).x ;

        let i1 = this._curve.findIntervalAtY(y1);
        this._curve.splitIntervalAtY(i1, y1);

        let i2 = this._curve.findIntervalAtY(y2);
        this._curve.splitIntervalAtY(i2, y2);

        let intervals = this._curve.findIntervalsBetweenY(y1, y2);
        intervals.pop();

        let remainderIntervals = this._curve.findIntervalsFromY(y2);

        let diff = intervals[0].p2.x - intervals[0].p1.x;
        intervals[0].p2.x = intervals[0].p1.x;

        for (let j = 0; j < remainderIntervals.length; j++) {
            let itvl = remainderIntervals[j];
            itvl.p1.x -= diff;
            itvl.p2.x -= diff;
        }
    }

    scry(value) {
        let p = new Point(value, 0);
        return this._curve.scryY(p);
    }

    reverseScry(value) {
        let p = new Point(0.0, value);
        return this._curve.scryX(p);
    }
}
