import { GameObject } from '../GameObject';
import { Panels } from '../../Types/Panels';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Engine } from '../../Engine';

export class HoldExtensibleTexture extends GameObject {
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

        this._map = this._resourceManager.getHoldExtensibleTexture(
            this._kind,
            noteskin
        );

        this._spritePosition = 0;
        this._animationDelta = 0;
    }

    update(delta: number) {
        this.updateTextureAnimation(delta);
    }

    updateTextureAnimation(delta: number) {
        const timeStamp = this._animationDelta + delta;

        const movement = timeStamp * this._stepAnimationRate;

        if (movement > 1) {
            this._spritePosition = (this._spritePosition + 1) % 6;

            const XOffset6x1 = ((this._spritePosition + 3) % 6) * (1 / 6);

            this._map.offset.set(XOffset6x1, 0.0);

            this._animationDelta = 0;
        } else {
            this._animationDelta += delta;
        }
    }
}
