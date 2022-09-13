"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

import {GameObject} from "../GameObject.js";
import {ResourceManager} from "../../Resources/ResourceManager";
import {Engine} from "../../Engine";

export class Explosion extends GameObject {

    _mesh ;
    _explosionAnimationRate: number ;
    _lastStepTimeStamp: number ;
    _animationPosition: number ;


    constructor(resourceManager: ResourceManager, engine: Engine, noteskin: string) {

        super(resourceManager, engine);
        this._explosionAnimationRate = 3 ;
        this._mesh = this._resourceManager.constructExplosion( noteskin ) ;

        this._lastStepTimeStamp = 0 ;
        this._animationPosition = 10 ;
    }

    ready() {

        // This acts as UV mapping.
        this._mesh.material.map.repeat.set(2/20, 2/4);
        // explosionMap.offset.set( 0 , 0 );
        this._mesh.material.map.offset.set(1/20, 1/4);

        // explosionMap.blending = THREE.AdditiveBlending ;

        // Augment the brightness of the explosion
        let scale = 1.25 ;

        this._mesh.material.color.r = scale ;
        this._mesh.material.color.g = scale ;
        this._mesh.material.color.b = scale ;


        this._mesh.scale.x = 2.5 ;
        this._mesh.scale.y = 2.5 ;

    }

    set animationPosition(value: number){
        this._animationPosition = value ;
    }

    animate() {
        this._animationPosition = 0 ;
        this._lastStepTimeStamp = 0 ;
        this._mesh.material.map.offset.set( 1 / 20, 1 / 4);
    }

    update(delta: number) {


        if (this._animationPosition <= 4 ) {

            // if (this._animationPosition === 0) {
            //     this._mesh.scale.x = 3.0 ;
            //     this._mesh.scale.y = 3.0 ;
            // } else if (this._animationPosition === 1) {
            //     this._mesh.scale.x = 2.0 ;
            //     this._mesh.scale.y = 2.0 ;
            // } else {
            //     this._mesh.scale.x = 2.5 ;
            //     this._mesh.scale.y = 2.5 ;
            // }


            let timeStamp = this._lastStepTimeStamp + delta;
            this._mesh.material.opacity = 1.0;
            let movement = timeStamp / (this._explosionAnimationRate*0.016);

            if (movement > 1) {
                this._animationPosition = (this._animationPosition + 1);
                this._mesh.material.map.offset.set(this._animationPosition * (1 / 5) + 1 / 20, 1 / 4);

                this._lastStepTimeStamp = timeStamp % (this._explosionAnimationRate*0.016);

            } else {
                this._lastStepTimeStamp += delta;
            }
        } else {
            this._mesh.material.opacity = 0.0;
        }

    }

    get object () {
        return this._mesh;
    }
}
