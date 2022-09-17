import { GameObject } from '../GameObject.js';
import { Panels } from '../../Types/Panels';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Engine } from '../../Engine';

export class StepNoteTexture extends GameObject {
    _map: THREE.Texture;
    _kind: Panels;

    _spritePosition: number;
    _stepAnimationRate: number;
    _animationDelta: number;

    constructor(
        resourceManager: ResourceManager,
        engine: Engine,
        kind: Panels,
        animationRate: number,
        noteskin: string
    ) {
        super(resourceManager, engine);
        this._kind = kind;
        this._stepAnimationRate = animationRate;

        this._map = this._resourceManager.getStepNoteTexture(
            this._kind,
            noteskin
        );

        this._spritePosition = 0;
        this._animationDelta = 0;
    }

    ready() {
        this._map.repeat.set(1 / 3, 1 / 2);
    }

    // This one is not empty
    update(delta: number) {
        this.updateTextureAnimation(delta);
    }

    updateTextureAnimation(delta: number) {
        const timeStamp = this._animationDelta + delta;

        const movement = timeStamp * this._stepAnimationRate;

        if (movement > 1) {
            this._spritePosition = (this._spritePosition + 1) % 6;

            const col = this._spritePosition % 3;
            // in UV cordinates, the first row is the lowest one.

            const row = Math.floor(this._spritePosition / 3);

            const XOffset3x2 = col * (1 / 3);

            const YOffset3x2 = row * (1 / 2);

            this._map.offset.set(XOffset3x2, YOffset3x2);

            this._animationDelta = 0;
        } else {
            this._animationDelta += delta;
        }
    }
}
