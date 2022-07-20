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

import readFileContent from '../Utils/FileReader.js';
import { parseSSC } from 'ssc-parser';
import * as THREE from 'three';
import { Engine } from 'src/Engine.js';

export class Song {
    meta: Record<string, string> = {};
    levels: Record<string, string>[] = [];
    requiresResync = false;
    readyToStart = false;
    syncTime: number;
    delay = 0.0;
    context!: AudioContext;
    source!: AudioBufferSourceNode;
    startTime!: number;
    constructor(
        public engine: Engine,
        public pathToSSCFile: string,
        public audioBuf: string, //?
        public offset: number,
        public playBackSpeed: number,
        public onReadyToStart: () => void
    ) {
        this.pathToSSCFile = pathToSSCFile;
        this.syncTime = offset;
    }

    async initSSC() {
        await readFileContent(this.pathToSSCFile, this.loadSSC.bind(this));
    }

    getWARPS(levelIndex: number) {
        let arr;
        if ('WARPS' in this.levels[levelIndex]) {
            arr = this.levels[levelIndex].WARPS;
        } else if ('WARPS' in this.meta) {
            arr = this.meta['WARPS'];
        } else {
            return [];
        }
        return arr;
    }

    getLevelDifficulty(levelIndex: number) {
        return parseInt(this.levels[levelIndex].METER) === undefined
            ? 1
            : parseInt(this.levels[levelIndex].METER);
    }

    getBMPs(levelIndex: number) {
        if ('BPMS' in this.levels[levelIndex]) {
            return this.levels[levelIndex].BPMS;
        } else {
            return this.meta['BPMS'];
        }
    }

    getTickCounts(levelIndex: number) {
        if ('TICKCOUNTS' in this.levels[levelIndex]) {
            return this.levels[levelIndex].TICKCOUNTS;
        } else if ('TICKCOUNTS' in this.meta) {
            return this.meta['TICKCOUNTS'];
        } else {
            return [[0.0, 4]];
        }
    }

    getScrolls(levelIndex: number) {
        if ('SCROLLS' in this.levels[levelIndex]) {
            return this.levels[levelIndex].SCROLLS;
        } else if ('SCROLLS' in this.meta) {
            return this.meta['SCROLLS'];
        } else {
            return [[0.0, 1.0]];
        }
    }

    getStops(levelIndex: number) {
        let arr;
        if ('STOPS' in this.levels[levelIndex]) {
            arr = this.levels[levelIndex].STOPS;
        } else if ('STOPS' in this.meta) {
            arr = this.meta['STOPS'];
        } else {
            return [];
        }
        return arr;
    }

    getDelays(levelIndex: number) {
        let arr;
        if ('DELAYS' in this.levels[levelIndex]) {
            arr = this.levels[levelIndex].DELAYS;
        } else if ('DELAYS' in this.meta) {
            arr = this.meta['DELAYS'];
        } else {
            return [];
        }
        return arr;
    }

    getSpeeds(levelIndex: number) {
        if ('SPEEDS' in this.levels[levelIndex]) {
            return this.levels[levelIndex].SPEEDS;
        } else if ('SPEEDS' in this.meta) {
            return this.meta['SPEEDS'];
        } else {
            return [[0.0, 1.0, 0.0, 0.0]];
        }
    }

    getOffset(levelIndex: number) {
        if ('OFFSET' in this.levels[levelIndex]) {
            return this.levels[levelIndex].OFFSET;
        } else {
            return this.meta['OFFSET'];
        }
    }

    getBannerPath() {
        return (
            this.pathToSSCFile.substr(0, this.pathToSSCFile.lastIndexOf('/')) +
            '/' +
            this.meta['BACKGROUND']
        );
    }

    getTickCountAtBeat(levelIndex: number, beat: number) {
        const tickCounts = this.getTickCounts(levelIndex);
        let last = tickCounts[0][1];
        for (const tickCount of tickCounts) {
            const beatInTick = tickCount[0];
            const tick = tickCount[1];
            if (beat >= beatInTick) {
                last = tick;
            } else {
                return last;
            }
        }
        return last;
    }

    getBPMAtBeat(levelIndex: number, beat: number) {
        const tickCounts = this.getBMPs(levelIndex);
        let last = tickCounts[0][1];
        for (const tickCount of tickCounts) {
            const beatInTick = +tickCount[0];
            const tick = tickCount[1];
            if (beat >= beatInTick) {
                last = tick;
            } else {
                return last;
            }
        }
        return last;
    }

    getSpeedAndTimeAtBeat(levelIndex: number, beat: number) {
        const speeds = this.getSpeeds(levelIndex);
        let last = speeds[0];
        for (const speed of speeds) {
            const beatInSpeed = speed[0];
            if (beat >= beatInSpeed) {
                last = speed;
            } else {
                // we also return the type: time in seconds or beats.
                return [last[1], last[2], last[3]];
            }
        }
        return [last[1], last[2], last[3]];
    }

    getLevelStyle(levelIndex: number) {
        return this.levels[levelIndex].STEPSTYPE;
    }

    getMusicPath() {
        return (
            this.pathToSSCFile.substr(0, this.pathToSSCFile.lastIndexOf('/')) +
            '/' +
            this.meta['MUSIC']
        );
        // return this.musicPath ;
    }

    loadSSC(content: string) {
        const parse = parseSSC(content);
        this.meta = parse.header;
        this.levels = parse.levels;
    }

    setNewPlayBackSpeed(newPlayBackSpeed: number) {
        this.source.playbackRate.value = newPlayBackSpeed;
        this.playBackSpeed = newPlayBackSpeed;
        // this.requiresResync = true ;
    }

    play() {
        const audioLoader = new THREE.AudioLoader();
        if ('webkitAudioContext' in window) {
            this.context = new (window as any).webkitAudioContext();
        } else {
            this.context = new AudioContext();
        }
        audioLoader.load(this.audioBuf, this.setUpPlayBack.bind(this));

        // context.decodeAudioData(this.audioBuf, this.playBack.bind(this));

        //analyser = new THREE.AudioAnalyser( audio, 32 );
        // audioLoader.load( this.getMusicPath(), this.playBack.bind(this)
        //
        //
        // );

        // this.startTime =  ;
    }

    setUpPlayBack(buf: AudioBuffer) {
        this.source = this.context.createBufferSource();
        this.source.playbackRate.value = this.playBackSpeed;
        this.source.onended = this.playBackEnded.bind(this);

        // source.detune.value = 1200 ;
        this.source.connect(this.context.destination);
        this.source.buffer = buf;
        this.onReadyToStart();

        // this.delay = this.songStartDelay() ;
    }

    startPlayBack(startDate: number, getCurrentDatefn: () => number) {
        const currentDate = getCurrentDatefn();

        //           convert to secs
        this.delay = (startDate - currentDate) / 1000.0;

        this.startTime = this.context.currentTime;

        // this.startTime = 0;
        // console.log('start time: ' + this.startTime ) ;
        console.log('computed delay: ' + this.delay);
        this.source.start(this.startTime + this.delay);
        this.readyToStart = true;
    }

    playBackEnded() {
        this.context.close();
        this.engine.stop();
    }

    // This method is called when the buffer with the song is ready.
    // playBack( buffer ) {
    //
    //     let audioBufferSourceNode = this.context.createBufferSource();
    //     audioBufferSourceNode.buffer = buffer ;
    //     audioBufferSourceNode.connect(this.context.destination);
    //     this.startTime = this.context.currentTime;
    //     audioBufferSourceNode.start(this.startTime + this.delay) ;
    //     console.log('Start time: ' + this.startTime);
    //
    // }

    getCurrentAudioTime(levelIndex: number) {
        // return this.context.currentTime ;
        // console.log('Outside start time: ' + this.startTime) ;
        // this.levels[levelIndex].meta['OFFSET'] ;
        if (this.readyToStart === false) return -1.0;
        return (
            this.context.currentTime -
            this.delay +
            +this.getOffset(levelIndex) -
            this.startTime -
            this.syncTime
        );
        // return this.startTime - this.audio.context.currentTime + parseFloat(this.meta['OFFSET']);
        //return this.audio.context.currentTime + this.startTime + parseFloat(this.meta['OFFSET']);
    }

    getTotalOffset(levelIndex: number) {
        return -this.delay + +this.getOffset(levelIndex) - this.startTime;
    }

    closeBuff() {
        this.context.close();
    }
}
