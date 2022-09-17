import { Point } from './Point.js';
import { Interval, IntervalSide } from './Interval.js';

export class Curve {
    private _intervalList: Interval[] = [];

    constructor() {}

    addInterval(interval: Interval) {
        this._intervalList.push(interval);
    }

    scryY(p: Point): Point {
        for (const interval of this._intervalList) {
            if (interval.isInIntervalX(p)) {
                p.y = interval.scryY(p.x);
                return p;
            }
        }
        throw new Error(`Could not scryY: no interval defined for point ${p}`);
    }

    scryX(p: Point): Point {
        for (const interval of this._intervalList) {
            if (interval.isInIntervalY(p)) {
                p.x = interval.scryX(p.y);
                return p;
            }
        }
        throw new Error(`Could not scryX: no interval defined for point ${p}`);
    }

    findIntervalsBetweenX(x1: number, x2: number): Interval[] {
        const intervals: Interval[] = [];
        const p1 = new Point(x1, 0);
        const p2 = new Point(x2, 0);
        let firstit = 0;

        // find first interval
        for (let i = 0; i < this._intervalList.length; i++) {
            const itvl = this._intervalList[i];
            if (itvl.isInIntervalX(p1)) {
                intervals.push(itvl);
                firstit = i;
                break;
            }
        }

        //add remainder
        for (let i = firstit; i < this._intervalList.length; i++) {
            const itvl = this._intervalList[i];
            if (!intervals.includes(itvl)) {
                intervals.push(itvl);
            }
            if (itvl.isInIntervalX(p2)) {
                break;
            }
        }
        return intervals;
    }

    findIntervalsBetweenY(y1: number, y2: number): Interval[] {
        const intervals: Interval[] = [];
        const p1 = new Point(0, y1);
        const p2 = new Point(0, y2);
        let firstit = 0;

        // find first interval
        for (let i = 0; i < this._intervalList.length; i++) {
            const itvl = this._intervalList[i];
            if (itvl.isInIntervalY(p1)) {
                intervals.push(itvl);
                firstit = i;
                break;
            }
        }
        //add remainder
        for (let i = firstit; i < this._intervalList.length; i++) {
            const itvl = this._intervalList[i];
            if (!intervals.includes(itvl)) {
                intervals.push(itvl);
            }
            if (itvl.isInIntervalY(p2)) {
                break;
            }
        }

        return intervals;
    }

    findIntervalAtY(y: number): Interval {
        const p1 = new Point(0, y);

        // find first interval
        for (const itvl of this._intervalList) {
            if (itvl.isInIntervalY(p1)) {
                return itvl;
            }
        }

        throw new Error(`Could not find interval at y given ${y}`);
    }

    findIntervalsFromY(y: number): Interval[] {
        const intervals: Interval[] = [];
        const p1 = new Point(0, y);
        let firstit = 0;

        // find first interval
        for (let i = 0; i < this._intervalList.length; i++) {
            const itvl = this._intervalList[i];
            if (itvl.isInIntervalY(p1)) {
                intervals.push(itvl);
                firstit = i;
                break;
            }
        }
        //add remainder
        for (let i = firstit + 1; i < this._intervalList.length; i++) {
            const itvl = this._intervalList[i];
            intervals.push(itvl);
        }
        return intervals;
    }

    // TODO: test this function
    splitIntervalAtY(interval: Interval, y: number): number | null {
        const index = this._intervalList.findIndex((itvl) => itvl === interval);

        if (interval.sideOfInIntervalAtY(y) === IntervalSide.right) {
            interval.p2 = new Point(interval.scryX(y + 1.0), y + 1.0);
            return this.splitIntervalAtY(interval, y);
        } else if (interval.sideOfInIntervalAtY(y) === IntervalSide.left) {
            interval.p1 = new Point(interval.scryX(y - 1.0), y - 1.0);
            return this.splitIntervalAtY(interval, y);
        }

        if (y === interval.p1.y || y === interval.p2.y) {
            return null;
        }

        const point1 = new Point(interval.scryX(y), y);
        const point2 = new Point(interval.scryX(y), y);

        const chunk1 = new Interval(
            interval.p1,
            point1,
            interval.openLeft,
            false
        );
        const chunk2 = new Interval(
            point2,
            interval.p2,
            false,
            interval.openRight
        );

        this._intervalList.splice(index, 1, chunk1, chunk2);

        return index;
    }

    addIntervalAtIndex(index: number, itvl: Interval): void {
        this._intervalList.splice(index, 0, itvl);
    }

    getIntervalsFromIndex(index: number): Interval[] {
        return this._intervalList.slice(index);
    }
}
