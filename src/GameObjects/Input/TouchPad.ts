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
'use strict'; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

import { Pad } from './Pad';
import { TouchTile } from './TouchTile';
import * as THREE from 'three';
import { Engine } from '@src/Engine';
import { ResourceManager } from '@src/Resources/ResourceManager';
import { FrameLog } from '../Sequence/SeqLog/FrameLog';
import { Panels } from '@src/Types/Panels';

class TouchPad extends Pad {
    _mesh;
    _tiles: { [panel in Panels]?: TouchTile } = {};
    _noteskin;

    constructor(
        resourceManager: ResourceManager,
        engine: Engine,
        padId: string,
        frameLog: FrameLog,
        noteskin: string
    ) {
        super(resourceManager, engine, null, padId, frameLog);
        this._noteskin = noteskin;
        // this._mesh = this._resourceManager.constructTouchInput() ;
        this._mesh = new THREE.Object3D();
        this.constructTiles();
    }

    constructTiles() {
        this._tiles = {
            dl: new TouchTile(
                this._resourceManager,
                this.engine,
                'dl',
                this._noteskin
            ),
            ul: new TouchTile(
                this._resourceManager,
                this.engine,
                'ul',
                this._noteskin
            ),
            c: new TouchTile(
                this._resourceManager,
                this.engine,
                'c',
                this._noteskin
            ),
            ur: new TouchTile(
                this._resourceManager,
                this.engine,
                'ur',
                this._noteskin
            ),
            dr: new TouchTile(
                this._resourceManager,
                this.engine,
                'dr',
                this._noteskin
            ),
        };

        const dist = 0.63;

        if (this._tiles.dl?.object) {
            this._tiles.dl.object.position.x = -dist;
            this._tiles.dl.object.position.y = -dist;
        }
        if (this._tiles.ul?.object) {
            this._tiles.ul.object.position.x = -dist;
            this._tiles.ul.object.position.y = dist;
        }
        if (this._tiles.c?.object) {
            this._tiles.c.object.position.x = 0.0;
            this._tiles.c.object.position.y = 0.0;
        }
        if (this._tiles.ur?.object) {
            this._tiles.ur.object.position.x = dist;
            this._tiles.ur.object.position.y = dist;
        }
        if (this._tiles.dr?.object) {
            this._tiles.dr.object.position.x = dist;
            this._tiles.dr.object.position.y = -dist;
        }

        for (const { object } of Object.values(this._tiles)) {
            if (!object) continue;
            this._mesh.add(object);
        }
    }

    touchDown(x: number, y: number) {
        return Object.values(this._tiles).map((t) => t.touchDown(x, y));
    }

    touchUp(x: number, y: number) {
        return Object.values(this._tiles).map((t) => t.touchUp(x, y));
    }

    get object() {
        return this._mesh;
    }
}

export { TouchPad };
