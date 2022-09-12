'use strict';
import { InputConfig } from './InputConfig';

// good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

/**
 * Class for configuring the input for a touch-capable device. The input pad will be drawn on the screen.
 * For registering the touch input, it is necessary to pass the touch events into the engine through methods {@link Engine#touchDown}
 * and {@link Engine#touchUp}.
 * @param {number} [scale=1.0] scaling factor
 * @param {number} [X=0] X position of the pad with respect to the player's stage
 * @param {number} [Y=0] Y position of the pad with respect to the player's stage
 * @example
 *
 * let p1InputConfig = new TouchInputConfig() ;
 */
export class TouchInputConfig extends InputConfig {
    constructor(private _scale = 1.0, private _X = 0, private _Y = 0) {
        super();
    }

    get scale() {
        return this._scale;
    }

    get X() {
        return this._X;
    }

    get Y() {
        return this._Y;
    }
}
