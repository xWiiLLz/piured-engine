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

import { GameObject } from '../GameObject';
import { Second2Beat } from './Second2Beat';
import { Second2Displacement } from './Second2Displacement';
import { SongTime2Second } from './SongTime2Second';
import { Beat2Speed } from './Beat2Speed';
import { ResourceManager } from 'src/Resources/ResourceManager';
import { Engine } from 'src/Engine';
import { Song } from 'src/Song/Song';
import { WritableKeysWithType } from 'src/Types/Utils';

export class BeatManager extends GameObject {
    scrollList: string | number[][];
    stopsList: string | never[];
    warpsList: number[][] | never[];
    speedsList: string | number[][];
    customOffset: number;
    requiresResync: boolean;
    second2beat: Second2Beat;
    second2displacement: Second2Displacement;
    songTime2Second: SongTime2Second;
    beat2speed: Beat2Speed;
    _speed: number;
    _currentAudioTime?: number;
    _currentAudioTimeReal?: number;
    _currentChartAudioTime?: number;
    _currentChartAudioTimeReal?: number;
    currentBPM!: number;
    currentYDisplacement!: number;
    currentBeat!: number;
    currentTickCount!: number;
    bpmList: number[][];
    delaysList: number[];
    constructor(
        public resourceManager: ResourceManager,
        public engine: Engine,
        public song: Song,
        public level: number,
        public speed: number,
        public keyBoardLag: number,
        public playBackSpeed: number
    ) {
        super(resourceManager, engine);

        this.bpmList = song.getBPMs(level);
        this.scrollList = song.getScrolls(level);
        this.stopsList = song.getStops(level);
        this.delaysList = song.getDelays(level);
        this.warpsList = song.getWARPS(level);
        this.speedsList = song.getSpeeds(level);
        this.song = song;
        this.level = level;
        this.keyBoardLag = keyBoardLag;
        this.customOffset = 0;
        this.requiresResync = false;

        // new beatmanager

        this.second2beat = new Second2Beat(this.bpmList);
        this.second2displacement = new Second2Displacement(
            this.scrollList,
            this.bpmList,
            this.second2beat
        );
        this.songTime2Second = new SongTime2Second(
            this.stopsList,
            this.delaysList,
            this.warpsList,
            this.second2beat
        );
        this.beat2speed = new Beat2Speed(this.speedsList, this.second2beat);
        this._speed = speed;
    }

    ready() {
        this._currentAudioTime = 0;
        this._currentAudioTimeReal = 0;
        this._currentChartAudioTime = 0;
        this._currentChartAudioTimeReal = 0;
        this.currentBPM = 0;
        this.currentYDisplacement = -100;
        this.currentBeat = 0;
        this.currentTickCount = 1;
    }

    setNewPlayBackSpeed(newPlayBackSpeed: number) {
        this.playBackSpeed = newPlayBackSpeed;
    }

    updateOffset(offset: number) {
        this.customOffset += offset;
        this.requiresResync = true;
    }

    private safeIncrement(
        key: WritableKeysWithType<BeatManager, number | undefined>,
        increment: number
    ) {
        this[key] = (this[key] ?? 0) + increment;
    }

    update(delta: number) {
        const songAudioTime =
            this.song.getCurrentAudioTime(this.level) - this.customOffset;

        if (songAudioTime <= 0.0 || this.requiresResync) {
            // if ( true ) {
            this.requiresResync = false;
            this._currentAudioTime = songAudioTime - this.keyBoardLag;
            this._currentAudioTimeReal = songAudioTime;
        } else {
            this.safeIncrement('_currentAudioTime', delta * this.playBackSpeed);
            this.safeIncrement(
                '_currentAudioTimeReal',
                delta * this.playBackSpeed
            );
        }

        this._currentChartAudioTime = this.songTime2Second.scry(
            this._currentAudioTime
        ).y;
        this._currentChartAudioTimeReal = this.songTime2Second.scry(
            this._currentAudioTimeReal
        ).y;

        this.currentYDisplacement = this.second2displacement.scry(
            this._currentChartAudioTime
        ).y;

        this.currentBeat = this.second2beat.scry(this._currentChartAudioTime).y;

        // console.log('time: '+ this.currentAudioTime +'\n dis: ' + this.currentYDisplacement + ' beat: '  + this.currentBeat +
        // '\n rds: ' + realDisp + ' rbet: ' + realBeat) ;

        this.updateCurrentBPM();

        this.currentTickCount = this.song.getTickCountAtBeat(
            this.level,
            this.currentBeat
        );
    }

    get currentAudioTime() {
        return this._currentChartAudioTime;
    }

    get currentAudioTimeReal() {
        return this._currentChartAudioTimeReal;
    }

    updateCurrentBPM() {
        const tickCounts = this.bpmList;
        let last = tickCounts[0][1];
        for (const tickCount of tickCounts) {
            const beatInTick = tickCount[0];
            const tick = tickCount[1];
            if (this.currentBeat >= beatInTick) {
                last = tick;
            } else {
                break;
            }
        }
        this.currentBPM = last;
    }

    getScrollAtBeat(beat: number) {
        const tickCounts = this.scrollList;
        let last = tickCounts[0];
        for (const tickCount of tickCounts) {
            const beatInTick = tickCount[0];
            const tick = tickCount[1];
            if (beat >= beatInTick) {
                last = tickCount;
            } else {
                return last;
            }
        }
        return last;
    }

    isNoteInWarp(beat: number) {
        for (const warp of this.warpsList) {
            const b1 = warp[0];
            const b2 = b1 + warp[1];
            if (beat >= b1 && beat < b2) {
                return true;
            }

            if (beat < b1) {
                return false;
            }
        }
        return false;
    }

    getCurrentSpeed() {
        return this.beat2speed.scry(this.currentBeat).y;
    }

    getYShiftAndCurrentTimeInSongAtBeat(beat: any) {
        const second = this.second2beat.reverseScry(beat).x;
        const yShift = -this.second2displacement.scry(second).y * this._speed;

        return [yShift, second];
    }
}
