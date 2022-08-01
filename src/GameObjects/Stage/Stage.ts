import { GameObject } from '../GameObject';
import { Background } from './Background';
import { PlayerStage } from './PlayerStage';
import { StepNoteTexture } from '../AnimatedTextures/StepNoteTexture';
import { HoldExtensibleTexture } from '../AnimatedTextures/HoldExtensibleTexture';
import * as THREE from 'three';
import { Engine } from '../../Engine';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Song } from '../../Song/Song';
import { VideoBackground } from './VideoBackground';

class Stage extends GameObject {
    _object;
    _bg;
    _playerStages;
    _noteskins;
    p1;
    song;
    animationRate;

    constructor(
        resourceManager: ResourceManager,
        engine: Engine,
        song: Song,
        noteskins: string[]
    ) {
        //...

        super(resourceManager, engine);
        this.animationRate = 30;
        this.song = song;

        this._object = new THREE.Object3D();

        this._playerStages = [];

        noteskins.forEach((noteskin) => {
            this.configureNoteTextures(noteskin);
        });
    }

    retrievePerformancePlayerStages() {
        const performances = [];
        for (let i = 0; i < this._playerStages.length; i++) {
            performances.push(this._playerStages[i].judgment.performance);
        }
        return performances;
    }

    configureNoteTextures(noteskin: string) {
        new StepNoteTexture(
            this._resourceManager,
            this.engine,
            'dl',
            this.animationRate,
            noteskin
        );
        new StepNoteTexture(
            this._resourceManager,
            this.engine,
            'ul',
            this.animationRate,
            noteskin
        );
        new StepNoteTexture(
            this._resourceManager,
            this.engine,
            'c',
            this.animationRate,
            noteskin
        );
        new StepNoteTexture(
            this._resourceManager,
            this.engine,
            'ur',
            this.animationRate,
            noteskin
        );
        new StepNoteTexture(
            this._resourceManager,
            this.engine,
            'dr',
            this.animationRate,
            noteskin
        );

        new HoldExtensibleTexture(
            this._resourceManager,
            this.engine,
            'dl',
            this.animationRate,
            noteskin
        );
        new HoldExtensibleTexture(
            this._resourceManager,
            this.engine,
            'ul',
            this.animationRate,
            noteskin
        );
        new HoldExtensibleTexture(
            this._resourceManager,
            this.engine,
            'c',
            this.animationRate,
            noteskin
        );
        new HoldExtensibleTexture(
            this._resourceManager,
            this.engine,
            'ur',
            this.animationRate,
            noteskin
        );
        new HoldExtensibleTexture(
            this._resourceManager,
            this.engine,
            'dr',
            this.animationRate,
            noteskin
        );
    }

    configureBG() {
        // this._bg = new Background(
        //     this._resourceManager,
        //     this.engine,
        //     this._playerStages[0].beatManager
        // );
        const video = new VideoBackground(
            this._resourceManager,
            this.engine,
            this._playerStages[0].beatManager
        );
        // this.engine.scene!.background = video.videoTexture;
        this._bg = video;
        this._bg.object.position.y = -3;
        this._bg.object.position.z = -1;
        this._object.add(this._bg.object);
    }

    addPlayerStage(playerConfig, playBackSpeed) {
        let lifebarOrientation;

        if (this._playerStages.length % 2 === 0) {
            lifebarOrientation = 'left2right';
        } else {
            lifebarOrientation = 'right2left';
        }

        let stage = new PlayerStage(
            this._resourceManager,
            this.engine,
            this.song,
            playerConfig,
            playBackSpeed,
            this._playerStages.length,
            lifebarOrientation
        );

        stage.setScale(playerConfig.scale);

        this._object.add(stage.object);
        this._playerStages.push(stage);
        this.adjustPlayerStages();

        // We can only configure the background if we have at least one stage (beat manager) set up.
        if (this._playerStages.length === 1) {
            this.configureBG();
        }

        // stageID
        return this._playerStages.length - 1;
    }

    logFrame(playerStageId, json) {
        this._playerStages[playerStageId].logFrame(json);
    }

    adjustPlayerStages() {
        let no_stages = this._playerStages.length;

        // if (no_stages === 1) {
        //     return ;
        // }

        let distance = 0;
        if (no_stages === 2) {
            distance = 7;
        } else {
            distance = 5;
        }

        for (let i = 0; i < no_stages; i++) {
            if (
                this.song.getLevelStyle(this._playerStages[i]._level) ===
                    'pump-double' ||
                this.song.getLevelStyle(this._playerStages[i]._level) ===
                    'pump-halfdouble'
            ) {
                distance = 9;
                break;
            }
        }

        let Xpos = -(distance * no_stages) / 2 + distance / 2;

        for (let i = 0; i < no_stages; i++) {
            this._playerStages[i].object.position.x =
                Xpos + this._playerStages[i].playerConfig.receptorX;
            this._playerStages[i].object.position.y =
                this._playerStages[i].playerConfig.receptorY;
            Xpos += distance;
        }
    }

    setNewPlayBackSpeed(newPlayBackSpeed) {
        for (let i = 0; i < this._playerStages.length; i++) {
            this._playerStages[i].setNewPlayBackSpeed(newPlayBackSpeed);
        }
    }

    updateOffset(stageId, newOffsetOffset) {
        this._playerStages[stageId].beatManager.updateOffset(newOffsetOffset);
    }

    ready() {}

    update(delta) {}

    get object() {
        return this._object;
    }
}

export { Stage };
