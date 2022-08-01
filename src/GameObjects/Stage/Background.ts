import { Engine } from '../../Engine';
import { ResourceManager } from '../../Resources/ResourceManager';
import { BeatManager } from '../BeatManager/BeatManager';
import { GameObject } from '../GameObject';

class Background extends GameObject {
    _mesh;
    _beatManager;
    _elapsedTime;
    _frame;

    constructor(
        resourceManager: ResourceManager,
        engine: Engine,
        beatManager: BeatManager
    ) {
        super(resourceManager, engine);

        this._mesh = resourceManager.constructBackground();
        this._beatManager = beatManager;
        this._elapsedTime = 0;
        this._frame = 0;
    }

    ready() {
        // noop
    }

    update(delta: number) {
        this._elapsedTime += delta;
        this._frame += 1; // this._beatManager.currentBeat ;
        this._mesh.material.uniforms.u_time.value = this._elapsedTime;
        this._mesh.material.uniforms.u_frame.value = this._frame;
        // this._mesh.material.uniforms.u_mouse.value.x = this._frame  ;

        const bpm = this._beatManager.currentBPM;
        const currentAudioTime = this._beatManager.currentAudioTimeReal;
        const beatsPerSecond = bpm / 60;
        const secondsPerBeat = 60 / bpm;

        if (currentAudioTime < 0) {
            this._mesh.material.uniforms.uThreshold.value = 0.3;
            return;
        }

        const timeInBeat = Math.abs(currentAudioTime % secondsPerBeat);
        const normalizedTimeInBeat = beatsPerSecond * timeInBeat;
        let opacityLevel = 1 - normalizedTimeInBeat;

        const tal = (1 - opacityLevel * opacityLevel) * 0.7 + 0.1;
        this._mesh.material.uniforms.uThreshold.value = tal;
        this._mesh.material.uniforms.u_mouse.value.x =
            2000 * (1 - tal * 0.3) + this._frame;
        this._mesh.material.uniforms.u_mouse.value.y =
            2000 * (1 - tal * 0.3) + this._frame;
    }

    get object() {
        return this._mesh;
    }
}

export { Background };
