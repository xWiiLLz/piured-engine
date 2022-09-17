import { GameObject } from '../GameObject.js';
import { Judgment } from './Judgment.js';
import { ResourceManager } from '../../Resources/ResourceManager';
import { Engine } from '../../Engine';
import { LifeBar } from '../LifeBar/LifeBar';
import { FrameLog } from '../Sequence/SeqLog/FrameLog';
import { Grade } from './Banner';

export enum StageGrade {
    SSS = 'SSS',
    SS = 'SS',
    S = 'S',
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    F = 'F',
}

type Stats = {
    p: number;
    gr: number;
    go: number;
    b: number;
    m: number;
    maxCombo: number;
    score: number;
    grade?: StageGrade;
};

export class JudgmentScale extends GameObject {
    _judgment: Judgment;
    _lifeBar: LifeBar;
    _state = 0;
    _counter = 0;
    _barSteps = 60;
    _currentStep = 30;
    _frameLog: FrameLog;
    levelStyle: string;
    levelDifficulty: number;
    comboCount: number;
    missComboCount: number;
    stats: Stats;
    score: number;
    generalScoreMultiplier: number;
    private accuracyMargin: number;

    constructor(
        resourceManager: ResourceManager,
        engine: Engine,
        accuracyMargin: number,
        levelStyle: string,
        levelDifficulty: number,
        lifeBar: LifeBar,
        frameLog: FrameLog
    ) {
        super(resourceManager, engine);

        this._lifeBar = lifeBar;
        this.accuracyMargin = accuracyMargin;
        this.levelStyle = levelStyle;
        this.levelDifficulty = levelDifficulty;
        this._judgment = new Judgment(this._resourceManager, this.engine);
        this._frameLog = frameLog;
        this.comboCount = 0;
        this.missComboCount = 0;
        this.score = 0;
        this.stats = {
            p: 0,
            gr: 0,
            go: 0,
            b: 0,
            m: 0,
            maxCombo: 0,
            score: 0,
        };
        this.generalScoreMultiplier = 1.0;

        if (this.levelDifficulty > 10) {
            this.generalScoreMultiplier *= this.levelDifficulty / 10.0;
        }
        if (this.levelStyle === 'pump-double') {
            this.generalScoreMultiplier *= 1.2;
        }
    }

    update(delta: number) {
        if (this._currentStep <= 0) {
            this._currentStep = 0;
        }
    }

    updateCombo(value: number) {
        this.comboCount = value;
        if (this.comboCount > this.stats.maxCombo) {
            this.stats.maxCombo = this.comboCount;
        }
    }

    // TODO:
    miss(comboIncrement = 1) {
        this.updateCombo(0);
        this.missComboCount += comboIncrement;
        this.stats.m += comboIncrement;
        this.addJudgmentToScore(-500);
        this._judgment.animate(Grade.miss, this.comboCount);

        if (this._currentStep > 60) {
            this._state = 5;
            this._counter = 0;
            this._currentStep = 60;
        }

        if (this._state === 5) {
            if (this._counter >= 3) {
                this._currentStep = 54;
                this._state = 0;
                this._counter = 0;
            } else {
                this._counter += 1;
            }
        } else {
            this._currentStep -= 6;
            this._counter = 0;
            this._state = 0;
        }

        this._lifeBar.setsize(this._currentStep / this._barSteps);

        this._frameLog.logJudgment(
            Grade.miss,
            this.comboCount,
            this._currentStep
        );
    }
    bad() {
        this.missComboCount = 0;
        this.updateCombo(0);
        this.stats.b += 1;
        this.addJudgmentToScore(-200);
        this._judgment.animate(Grade.bad, this.comboCount);

        this._state = 0;
        this._counter = 0;

        this._frameLog.logJudgment(
            Grade.bad,
            this.comboCount,
            this._currentStep
        );
    }

    good() {
        this.missComboCount = 0;
        this.stats.go += 1;
        this.addJudgmentToScore(100);
        this._judgment.animate(Grade.good, this.comboCount);

        this._state = 0;
        this._counter = 0;

        this._frameLog.logJudgment(
            Grade.good,
            this.comboCount,
            this._currentStep
        );
    }

    great() {
        this.missComboCount = 0;
        this.stats.gr += 1;
        this.updateCombo(this.comboCount + 1);
        this.addJudgmentToScore(500);
        this._judgment.animate(Grade.great, this.comboCount);

        if (this._state === 5) {
            this._state = 0;
        }

        this.counterUpdatePerfect(7, 0, 1, 1);

        this._frameLog.logJudgment(
            Grade.great,
            this.comboCount,
            this._currentStep
        );
    }

    perfect(comboIncrement = 1) {
        this.missComboCount = 0;
        this.stats.p += comboIncrement;
        this.updateCombo(this.comboCount + comboIncrement);
        this.addJudgmentToScore(1000);
        this._judgment.animate(Grade.perfect, this.comboCount);

        if (this._state === 5) {
            this._state = 0;
        }

        this.counterUpdatePerfect(7, 0, 1, comboIncrement);
        this.counterUpdatePerfect(6, 1, 2, comboIncrement);
        this.counterUpdatePerfect(4, 2, 3, comboIncrement);
        this.counterUpdatePerfect(2, 3, 3, comboIncrement);

        this._frameLog.logJudgment(
            Grade.perfect,
            this.comboCount,
            this._currentStep
        );
    }

    counterUpdatePerfect(
        updateCondition: number,
        fromState: number,
        toState: number,
        comboIncrement: number
    ) {
        if (this._state === fromState) {
            if (this._counter < updateCondition - 1) {
                this._counter += comboIncrement;
            } else {
                this._currentStep += 1;
                this._counter = 0;
                this._state = toState;
                this._lifeBar.setsize(this._currentStep / this._barSteps);
            }
        }
    }

    addJudgmentToScore(points: number) {
        const multiplier = 1.0;
        let bonus = 0;
        if (this.comboCount > 50) {
            bonus = 1000;
        }

        this.score +=
            (points + bonus) * this.generalScoreMultiplier * multiplier;
    }

    grade(timeElapse: number) {
        const tiersTime = this.accuracyMargin / 8;
        const tier = Math.floor(timeElapse / tiersTime);

        let grade = null;

        switch (tier) {
            case 0:
            case 1:
            case 2:
                this.perfect();
                grade = 'p';
                break;
            case 3:
            case 4:
                this.great();
                grade = 'gr';
                break;
            case 5:
            case 6:
                this.good();
                grade = 'go';
                break;
            case 7:
                this.bad();
                grade = 'b';
                break;
        }

        return grade;
    }

    setJudgment(grade: Grade, combo: number, step: number) {
        this.updateCombo(combo);
        this._currentStep = step;
        this._lifeBar.setsize(this._currentStep / this._barSteps);
        this._judgment.animate(grade, this.comboCount);
    }

    get performance() {
        this.computeFinalGrade();
        this.stats.score = this.score;
        if (this.stats.grade === 'SSS') {
            this.stats.score += 300000;
        } else if (this.stats.grade === 'SS') {
            this.stats.score += 150000;
        } else if (this.stats.grade === 'S') {
            this.stats.score += 100000;
        }
        return this.stats;
    }

    computeFinalGrade() {
        const { p, gr, go, b, m, maxCombo } = this.stats;
        if (gr === 0 && go === 0 && b === 0 && m === 0) {
            this.stats.grade = StageGrade.SSS;
        } else if (go === 0 && b === 0 && m === 0) {
            this.stats.grade = StageGrade.SS;
        } else {
            const accuracy =
                (p * 1.0 +
                    gr * 0.8 +
                    go * 0.6 +
                    maxCombo * 0.025 -
                    b * 1.0 -
                    m * 2.0) /
                (p + gr + go + b + m);
            if (accuracy > 1.0) {
                this.stats.grade = StageGrade.S;
            } else if (accuracy > 0.9) {
                this.stats.grade = StageGrade.A;
            } else if (accuracy > 0.85) {
                this.stats.grade = StageGrade.B;
            } else if (accuracy > 0.8) {
                this.stats.grade = StageGrade.C;
            } else if (accuracy > 0.75) {
                this.stats.grade = StageGrade.D;
            } else {
                this.stats.grade = StageGrade.F;
            }
        }
    }

    get object() {
        return this._judgment.object;
    }
}
