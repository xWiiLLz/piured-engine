/*
 * # Copyright (C) Pedro G. Bascoy
 # This file is part of piured-engine <https://github.com/piulin/piured-engine>.
 #
 # piured-engine is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # piured-engine is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with piured-engine.If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { Panels } from 'src/Types/Panels';
import { InputConfig } from './InputConfig';

type Key = KeyboardEvent['key'];

export type PadConfig = {
    [panel in Panels]: Key;
};

type PadConfigArg = {
    [panel in keyof typeof Panels]: Key;
};

const mapPadConfig = (input: PadConfigArg) =>
    Object.fromEntries(
        Object.entries(input).map(
            ([enumKey, value]) =>
                [Panels[enumKey as keyof typeof Panels], value] as const
        )
    ) as PadConfig;
/**
 * Class for configuring the keyboard as input method.
 * For registering key strokes, it is necessary to pass the key events into the engine through methods {@link Engine#keyDown}
 * and {@link Engine#keyUp}.
 * @param {{dl:string, ul:string, c:string, ur:string, dr:string}} lpad left pad keymap
 * @param {{dl:string, ul:string, c:string, ur:string, dr:string}} rpad right pad keymap
 * @example
 * let p1InputConfig = new KeyInputConfig({
 *    dl: 'Z',
 *    ul : 'Q',
 *    c : 'S',
 *    ur : 'E',
 *    dr: 'C'
 * },
 * {
 *    dl: 'V',
 *    ul : 'R',
 *    c : 'G',
 *    ur : 'Y',
 *    dr: 'N'
 * }) ;
 */

export class KeyInputConfig extends InputConfig {
    private _lpad: PadConfig;
    private _rpad: PadConfig;
    constructor(leftPad: PadConfigArg, rightPad: PadConfigArg) {
        super();

        this._lpad = mapPadConfig(leftPad);
        this._rpad = mapPadConfig(rightPad);
    }

    get lpad() {
        return this._lpad;
    }

    get rpad() {
        return this._rpad;
    }
}
