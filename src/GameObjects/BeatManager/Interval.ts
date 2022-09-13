import { Point } from './Point';

export enum IntervalSide {
    left,
    right,
    in,
}

export class Interval {
    constructor(
        private _p1: Point,
        private _p2: Point,
        private _openLeft: boolean,
        private _openRight: boolean
    ) {}

    isInIntervalX(p: Point): boolean {
        if (this._openLeft && this._openRight) {
            return true;
        } else if (this._openLeft) {
            return p.x < this._p2.x;
        } else if (this._openRight) {
            return p.x >= this._p1.x;
        }
        return p.x >= this._p1.x && p.x < this._p2.x;
    }

    isInIntervalY(p: Point): boolean {
        if (this._openLeft && this._openRight) {
            return true;
        } else if (this._openLeft) {
            return p.y < this._p2.y;
        } else if (this._openRight) {
            return p.y >= this._p1.y;
        }
        return p.y >= this._p1.y && p.y < this._p2.y;
    }

    scryY(x: number): number {
        const m = (this._p2.y - this._p1.y) / (this._p2.x - this._p1.x);

        const y = m * (x - this._p1.x) + this._p1.y;

        return y;
    }

    scryX(y: number): number {
        const m = (this._p2.x - this._p1.x) / (this._p2.y - this._p1.y);

        const x = m * (y - this._p1.y) + this._p1.x;

        return x;
    }

    sideOfInIntervalAtY(y: number): IntervalSide {
        const leftBoundary = this.scryY(this.p1.x);
        const rightBoundary = this.scryY(this.p2.x);

        if (y < leftBoundary) {
            return IntervalSide.left;
        } else if (y > rightBoundary) {
            return IntervalSide.right;
        }

        return IntervalSide.in;
    }

    get p1() {
        return this._p1;
    }

    get p2() {
        return this._p2;
    }

    set p1(value: Point) {
        this._p1 = value;
    }

    set p2(value: Point) {
        this._p2 = value;
    }

    get openLeft(): boolean {
        return this._openLeft;
    }

    get openRight(): boolean {
        return this._openRight;
    }
}
