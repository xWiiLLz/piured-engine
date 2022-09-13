import { Second2Beat } from './Second2Beat.js';
import { Point } from './Point.js';
import { Curve } from './Curve';

export class Second2Displacement {
    _curve: Curve;
    _scrolls: number[][];
    _s2b: Second2Beat;

    constructor(scrolls: number[][], bpms: number[][], s2b: Second2Beat) {
        this._scrolls = Array.from(scrolls);
        this._s2b = s2b;
        this._curve = new Second2Beat(bpms)._curve;
        const tolerance = 0.00001;

        for (let i = 0; i < this._scrolls.length - 1; i++) {
            const beat1 = this._scrolls[i][0];
            const scroll1 = this._scrolls[i][1];
            const beat2 = this._scrolls[i + 1][0];
            const scroll2 = this._scrolls[i + 1][1];

            const displacement1 = this._curve.scryY(
                this._s2b.reverseScry(beat1)
            ).y;
            const displacement2 = this._curve.scryY(
                this._s2b.reverseScry(beat2)
            ).y;

            const firstInterval = this._curve.findIntervalAtY(displacement1);
            this._curve.splitIntervalAtY(firstInterval, displacement1);

            const lastInterval = this._curve.findIntervalAtY(displacement2);
            this._curve.splitIntervalAtY(lastInterval, displacement2);

            const intervals = this._curve.findIntervalsBetweenY(
                displacement1,
                displacement2
            );

            if (
                Math.abs(intervals[intervals.length - 1].p1.y - displacement2) <
                tolerance
            ) {
                intervals.pop();
            }

            let prevp1 = intervals[0].p1;
            let prevdiff = 0.0;

            const remainderIntervals =
                this._curve.findIntervalsFromY(displacement2);

            //modify scroll sections
            for (let j = 0; j < intervals.length; j++) {
                const itvl1 = intervals[j];
                itvl1.p1 = prevp1;
                const oldy2 = itvl1.p2.y;
                itvl1.p2.y =
                    prevp1.y + (itvl1.p2.y - prevp1.y + prevdiff) * scroll1;

                prevp1 = new Point(itvl1.p2.x, itvl1.p2.y);
                prevdiff = itvl1.p2.y - oldy2;
            }

            for (let j = 0; j < remainderIntervals.length; j++) {
                const itvl = remainderIntervals[j];
                itvl.p1.y += prevdiff;
                itvl.p2.y += prevdiff;
            }
        }

        //last scroll

        const beat = this._scrolls[this._scrolls.length - 1][0];
        const scroll = this._scrolls[this._scrolls.length - 1][1];
        const displacement = this._curve.scryY(this._s2b.reverseScry(beat)).y;
        const interval = this._curve.findIntervalAtY(displacement);
        this._curve.splitIntervalAtY(interval, displacement);

        const intervals = this._curve.findIntervalsFromY(displacement);
        let prevp1 = intervals[0].p1;
        let prevdiff = 0.0;

        //modify scroll sections
        for (let j = 0; j < intervals.length; j++) {
            const itvl1 = intervals[j];
            itvl1.p1 = prevp1;
            const oldy2 = itvl1.p2.y;
            itvl1.p2.y = prevp1.y + (itvl1.p2.y - prevp1.y + prevdiff) * scroll;

            prevp1 = new Point(itvl1.p2.x, itvl1.p2.y);
            prevdiff = itvl1.p2.y - oldy2;
        }
    }

    scry(value: number): Point {
        const p = new Point(value, 0);
        return this._curve.scryY(p);
    }
}
