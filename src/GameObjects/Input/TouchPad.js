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
"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



import {Pad} from "./Pad.js";
import {TouchTile} from "./TouchTile.js";
import * as THREE from 'three'

class TouchPad extends Pad {

    _mesh ;
    _tiles ;
    _noteskin ;

    constructor(resourceManager, engine, padId, frameLog, noteskin) {
        super(resourceManager, engine, null, padId, frameLog) ;
        this._noteskin = noteskin ;
        // this._mesh = this._resourceManager.constructTouchInput() ;
        this._mesh = new THREE.Object3D() ;
        this.constructTiles() ;
    }


    constructTiles() {
        this._tiles = {
            'dl' : new TouchTile(this._resourceManager, this.engine, 'dl', this._noteskin),
            'ul' : new TouchTile(this._resourceManager,this.engine, 'ul',this._noteskin),
            'c' : new TouchTile(this._resourceManager,this.engine, 'c',this._noteskin),
            'ur' : new TouchTile(this._resourceManager,this.engine, 'ur',this._noteskin),
            'dr' : new TouchTile(this._resourceManager,this.engine, 'dr',this._noteskin)
        }

        const dist = 0.63 ;

        this._tiles.dl.object.position.x = -dist ;
        this._tiles.dl.object.position.y = -dist ;

        this._tiles.ul.object.position.x = -dist ;
        this._tiles.ul.object.position.y = dist ;

        this._tiles.c.object.position.x = 0.0 ;
        this._tiles.c.object.position.y = 0.0 ;

        this._tiles.ur.object.position.x = dist ;
        this._tiles.ur.object.position.y = dist ;

        this._tiles.dr.object.position.x = dist ;
        this._tiles.dr.object.position.y = -dist ;

        this._mesh.add(this._tiles.dl.object) ;
        this._mesh.add(this._tiles.ul.object) ;
        this._mesh.add(this._tiles.c.object) ;
        this._mesh.add(this._tiles.ur.object) ;
        this._mesh.add(this._tiles.dr.object) ;
    }


    touchDown(x, y) {

        let touchedTiles = [] ;

        touchedTiles.push(this._tiles.dl.touchDown(x,y)) ;
        touchedTiles.push(this._tiles.ul.touchDown(x,y)) ;
        touchedTiles.push(this._tiles.c.touchDown(x,y))  ;
        touchedTiles.push(this._tiles.ur.touchDown(x,y)) ;
        touchedTiles.push(this._tiles.dr.touchDown(x,y)) ;

        return touchedTiles ;

    }

    touchUp(x,y) {
        let touchedTiles = [] ;

        touchedTiles.push(this._tiles.dl.touchUp(x,y)) ;
        touchedTiles.push(this._tiles.ul.touchUp(x,y)) ;
        touchedTiles.push(this._tiles.c.touchUp(x,y))  ;
        touchedTiles.push(this._tiles.ur.touchUp(x,y)) ;
        touchedTiles.push(this._tiles.dr.touchUp(x,y)) ;

        return touchedTiles ;

    }


    get object () {
        return this._mesh;
    }


}

export {TouchPad} ;