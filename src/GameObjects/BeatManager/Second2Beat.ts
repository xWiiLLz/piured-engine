import {Curve} from "./Curve.js";
import {Point} from "./Point.js";
import {Interval} from "./Interval.js";

export class Second2Beat {

    _curve: Curve ;
    _bpms: number[][];

    constructor(bpms: number[][]) {

        let longFloat = 100000.0 ;
        this._bpms = Array.from(bpms) ;
        this._curve = new Curve() ;


        let l = Array.from(this._bpms[this._bpms.length -1]) ;
        l[0] += longFloat ;
        this._bpms.push(l)
        let prevPoint = new Point(0.0,0.0) ;

        for ( let i = 0 ; i < this._bpms.length -1 ; i++ ) {

            let beat1 = this._bpms[ i ][0] ;
            let bpm1 = this._bpms[ i ] [1] ;
            let beat2 = this._bpms[ i+1 ][0] ;
            let bpm2 = this._bpms[ i+1 ] [1] ;


            let x = this.secondsPerBeat(bpm1) * (beat2 - beat1) + prevPoint.x;
            let y = beat2 ;
            let p = new Point(x,y) ;

            let interval = new Interval(prevPoint, p , i === 0 ,i  === this._bpms.length -2) ;

            this._curve.addInterval(interval) ;

            prevPoint = new Point(p.x, p.y) ;


        }

    }

    scry(value: number): Point {

        let p = new Point(value, 0 ) ;
        return this._curve.scryY(p) ;

    }

    reverseScry(value: number): Point {

        let p = new Point(0.0, value ) ;
        return this._curve.scryX(p) ;

    }

    secondsPerBeat(bpm: number): number {

        return 1.0 / (bpm / 60.0) ;

    }


}