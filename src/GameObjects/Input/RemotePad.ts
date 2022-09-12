'use strict'; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

import { Engine } from '../../Engine';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Pad } from './Pad';

export class RemotePad extends Pad {
    constructor(
        resourceManager: ResourceManager,
        engine: Engine,
        protected _padId: string
    ) {
        super(resourceManager, engine, null, _padId);
    }

    get dlKeyPressed() {
        return this._dlKeyPressed;
    }

    set dlKeyPressed(value) {
        this._dlKeyPressed = value;
    }

    get ulKeyPressed() {
        return this._ulKeyPressed;
    }

    set ulKeyPressed(value) {
        this._ulKeyPressed = value;
    }

    get cKeyPressed() {
        return this._cKeyPressed;
    }

    set cKeyPressed(value) {
        this._cKeyPressed = value;
    }

    get urKeyPressed() {
        return this._urKeyPressed;
    }

    set urKeyPressed(value) {
        this._urKeyPressed = value;
    }

    get drKeyPressed() {
        return this._drKeyPressed;
    }

    set drKeyPressed(value) {
        this._drKeyPressed = value;
    }

    get dlKeyHold() {
        return this._dlKeyHold;
    }

    set dlKeyHold(value) {
        this._dlKeyHold = value;
    }

    get ulKeyHold() {
        return this._ulKeyHold;
    }
    set ulKeyHold(value) {
        this._ulKeyHold = value;
    }

    get cKeyHold() {
        return this._cKeyHold;
    }
    set cKeyHold(value) {
        this._cKeyHold = value;
    }

    get urKeyHold() {
        return this._urKeyHold;
    }
    set urKeyHold(value) {
        this._urKeyHold = value;
    }

    get drKeyHold() {
        return this._drKeyHold;
    }

    set drKeyHold(value) {
        this._drKeyHold = value;
    }
}
