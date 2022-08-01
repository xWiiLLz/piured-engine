import { BackgroundGeometry } from './Geometries/BackgroundGeometry';
import { ComboGeometry } from './Geometries/ComboGeometry';
import { DigitGeometry } from './Geometries/DigitGeometry';
import { StepGeometry } from './Geometries/StepGeometry';
import { HoldGeometry } from './Geometries/HoldGeometry';
import { JudgmentGeometry } from './Geometries/JudgmentGeometry';
import { ReceptorGeometry } from './Geometries/ReceptorGeometry';
import { LifeBarGeometry } from './Geometries/LifeBarGeometry';
import { DLifeBarGeometry } from './Geometries/DLifeBarGeometry';
import { TipGeometry } from './Geometries/TipGeometry';
import { PulseGeometry } from './Geometries/PulseGeometry';
import { PNGTexture } from './Textures/PNGTexture';
import { TransparentMaterial } from './Materials/TransparentMaterial';
import { BackgroundMaterial } from './Shaders/BackgroundMaterial';
import { AdditiveMaterial } from './Materials/AdditiveMaterial';
import { ReceptorMaterial } from './Shaders/ReceptorMaterial';
import * as THREE from 'three';
import { Panels } from '../Types/Panels';

type NoteskinTextureKeys =
    | 'SDL'
    | 'SUL'
    | 'SC'
    | 'SUR'
    | 'SDR'
    | 'HDL'
    | 'HUL'
    | 'HC'
    | 'HUR'
    | 'HDR'
    | 'R'
    | 'T'
    | 'FX';

type NoteskinTexture = {
    [key in NoteskinTextureKeys]: PNGTexture;
};

type StageTextureKeys =
    | 'DN'
    | 'DM'
    | 'C'
    | 'J'
    | 'SLBACK'
    | 'SLBAR'
    | 'SLBARFX'
    | 'SLBARFXRED'
    | 'SLFRONT'
    | 'DLBACK'
    | 'DLBAR'
    | 'DLBARFX'
    | 'DLBARFXRED'
    | 'DLFRONT'
    | 'LP'
    | 'LT';

type NoteskinMaterials = {
    [key in Exclude<
        NoteskinTextureKeys,
        'R' | 'T' | 'FX'
    >]: TransparentMaterial;
};
class ResourceManager {
    _materialsDict: { NOTESKINS: Record<string, NoteskinMaterials> } = {
        NOTESKINS: {},
    };
    _geometryDict: {
        B: BackgroundGeometry;
        C: ComboGeometry;
        D: DigitGeometry;
        S: StepGeometry;
        H: HoldGeometry;
        J: JudgmentGeometry;
        R: ReceptorGeometry;
        L: LifeBarGeometry;
        DL: DLifeBarGeometry;
        T: TipGeometry;
        P: PulseGeometry;
    } = {} as any; // Loaded in constructor
    _textureDict: Record<StageTextureKeys, PNGTexture> & {
        NOTESKINS: Record<string, NoteskinTexture>;
    } = { NOTESKINS: {} as Record<string, NoteskinTexture> } as any;
    _shadersDict!: { B: BackgroundMaterial };

    constructor(
        public renderer: THREE.WebGLRenderer,
        public resourcePath: string,
        public noteskinPath: string,
        public noteskinIds: string[],
        public stagePath: string
    ) {
        this.loadGeometries();
        noteskinIds.forEach((noteskinId) => {
            this.loadNoteskinTextures(
                resourcePath + noteskinPath + noteskinId + '/UHD',
                noteskinId
            );
        });
        this.loadStageTextures(resourcePath + stagePath);
        this.loadMaterials();
        this.loadShaderMaterials();
    }

    loadGeometries() {
        // Geometries
        this._geometryDict['B'] = new BackgroundGeometry();
        this._geometryDict['C'] = new ComboGeometry();
        this._geometryDict['D'] = new DigitGeometry();
        this._geometryDict['S'] = new StepGeometry();
        this._geometryDict['H'] = new HoldGeometry();
        this._geometryDict['J'] = new JudgmentGeometry();
        this._geometryDict['R'] = new ReceptorGeometry();
        this._geometryDict['L'] = new LifeBarGeometry();
        this._geometryDict['DL'] = new DLifeBarGeometry();
        this._geometryDict['T'] = new TipGeometry();
        this._geometryDict['P'] = new PulseGeometry();
    }

    loadNoteskinTextures(noteskinPath: string, noteskinId: string) {
        if (noteskinId in this._textureDict['NOTESKINS']) {
            return;
        }

        const stepDic: NoteskinTexture = {
            // StepNotes
            SDL: new PNGTexture(
                this.renderer,
                noteskinPath + '/DownLeft TapNote 3x2.PNG'
            ),
            SUL: new PNGTexture(
                this.renderer,
                noteskinPath + '/UpLeft TapNote 3x2.PNG'
            ),
            SC: new PNGTexture(
                this.renderer,
                noteskinPath + '/Center TapNote 3x2.PNG'
            ),
            SUR: new PNGTexture(
                this.renderer,
                noteskinPath + '/UpRight TapNote 3x2.PNG'
            ),
            SDR: new PNGTexture(
                this.renderer,
                noteskinPath + '/DownRight TapNote 3x2.PNG'
            ),

            //Holds & EndNotes
            HDL: new PNGTexture(
                this.renderer,
                noteskinPath + '/DownLeft Hold 6x1.PNG'
            ),
            HUL: new PNGTexture(
                this.renderer,
                noteskinPath + '/UpLeft Hold 6x1.PNG'
            ),
            HC: new PNGTexture(
                this.renderer,
                noteskinPath + '/Center Hold 6x1.PNG'
            ),
            HUR: new PNGTexture(
                this.renderer,
                noteskinPath + '/UpRight Hold 6x1.PNG'
            ),
            HDR: new PNGTexture(
                this.renderer,
                noteskinPath + '/DownRight Hold 6x1.PNG'
            ),

            //Receptor
            R: new PNGTexture(
                this.renderer,
                noteskinPath + '/Center Receptor 1x2.PNG'
            ),

            //Taps
            T: new PNGTexture(this.renderer, noteskinPath + '/Tap 5x2.PNG'),

            FX: new PNGTexture(this.renderer, noteskinPath + '/StepFX 5x1.PNG'),
        };
        this._textureDict['NOTESKINS'][noteskinId] = stepDic;
    }

    loadStageTextures(stagePath: string) {
        // Digits Normal
        this._textureDict['DN'] = new PNGTexture(
            this.renderer,
            stagePath + '/Combo numbers Normal 4x4_XX.png'
        );

        // Digits Miss
        this._textureDict['DM'] = new PNGTexture(
            this.renderer,
            stagePath + '/Combo numbers Miss 4x4.png'
        );

        // Combo
        this._textureDict['C'] = new PNGTexture(
            this.renderer,
            stagePath + '/Combo 1x2_XX_r.png'
        );

        // Judgment
        this._textureDict['J'] = new PNGTexture(
            this.renderer,
            stagePath + '/Player_Judgment Rank 1x6_XX_r.png'
        );

        // Life meter bar
        this._textureDict['SLBACK'] = new PNGTexture(
            this.renderer,
            stagePath + '/LifeMeterBar_S_Back 1x2.png'
        );
        this._textureDict['SLBAR'] = new PNGTexture(
            this.renderer,
            stagePath + '/LifeMeterBar_S_Bar 1x2.png'
        );
        this._textureDict['SLBARFX'] = new PNGTexture(
            this.renderer,
            stagePath + '/LifeMeterBar_S_Bar_FX.png'
        );
        this._textureDict['SLBARFXRED'] = new PNGTexture(
            this.renderer,
            stagePath + '/LifeMeterBar_S_Bar_FX_Red.png'
        );
        this._textureDict['SLFRONT'] = new PNGTexture(
            this.renderer,
            stagePath + '/LifeMeterBar_S_Front.png'
        );

        this._textureDict['DLBACK'] = new PNGTexture(
            this.renderer,
            stagePath + '/LifeMeterBar_D_Back 1x2.png'
        );
        this._textureDict['DLBAR'] = new PNGTexture(
            this.renderer,
            stagePath + '/LifeMeterBar_D_Bar 1x2.png'
        );
        this._textureDict['DLBARFX'] = new PNGTexture(
            this.renderer,
            stagePath + '/LifeMeterBar_D_Bar_FX.png'
        );
        this._textureDict['DLBARFXRED'] = new PNGTexture(
            this.renderer,
            stagePath + '/LifeMeterBar_D_Bar_FX_Red.png'
        );
        this._textureDict['DLFRONT'] = new PNGTexture(
            this.renderer,
            stagePath + '/LifeMeterBar_D_Front.png'
        );

        this._textureDict['LP'] = new PNGTexture(
            this.renderer,
            stagePath + '/pulse.png'
        );
        this._textureDict['LT'] = new PNGTexture(
            this.renderer,
            stagePath + '/SG-TIP 1x2.png'
        );
    }

    loadMaterials() {
        for (const [noteskinId, textureDict] of Object.entries(
            this._textureDict['NOTESKINS']
        )) {
            const materialsDict: NoteskinMaterials = {
                // StepNotes
                SDL: new TransparentMaterial(textureDict['SDL'].map),
                SUL: new TransparentMaterial(textureDict['SUL'].map),
                SC: new TransparentMaterial(textureDict['SC'].map),
                SUR: new TransparentMaterial(textureDict['SUR'].map),
                SDR: new TransparentMaterial(textureDict['SDR'].map),

                //Holds & EndNotes
                HDL: new TransparentMaterial(textureDict['HDL'].map),
                HUL: new TransparentMaterial(textureDict['HUL'].map),
                HC: new TransparentMaterial(textureDict['HC'].map),
                HUR: new TransparentMaterial(textureDict['HUR'].map),
                HDR: new TransparentMaterial(textureDict['HDR'].map),
            };

            this._materialsDict['NOTESKINS'][noteskinId] = materialsDict;
        }
    }

    loadShaderMaterials() {
        // Background
        this._shadersDict = { B: new BackgroundMaterial(this.resourcePath) };
    }

    constructStepNote(kind: Panels, noteskinId: string) {
        const materialsDict = this._materialsDict['NOTESKINS'][noteskinId];
        switch (kind) {
            case 'dl':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    materialsDict['SDL'].material
                );
            case 'ul':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    materialsDict['SUL'].material
                );
            case 'c':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    materialsDict['SC'].material
                );
            case 'ur':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    materialsDict['SUR'].material
                );
            case 'dr':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    materialsDict['SDR'].material
                );
        }
    }

    constructStepNoteCloned(kind: Panels, noteskinId: string) {
        const textureDict = this._textureDict['NOTESKINS'][noteskinId];
        switch (kind) {
            case 'dl':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    new TransparentMaterial(
                        textureDict['SDL'].cloneMap()
                    ).material
                );
                break;
            case 'ul':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    new TransparentMaterial(
                        textureDict['SUL'].cloneMap()
                    ).material
                );
                break;
            case 'c':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    new TransparentMaterial(
                        textureDict['SC'].cloneMap()
                    ).material
                );
                break;
            case 'ur':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    new TransparentMaterial(
                        textureDict['SUR'].cloneMap()
                    ).material
                );
                break;
            case 'dr':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    new TransparentMaterial(
                        textureDict['SDR'].cloneMap()
                    ).material
                );
                break;
        }
    }

    constructSLifeBarBack() {
        return new THREE.Mesh(
            this._geometryDict['L'].lifeBarGeometry,
            new TransparentMaterial(
                this._textureDict['SLBACK'].cloneMap()
            ).material
        );
    }

    constructSLifeBarBar() {
        return new THREE.Mesh(
            this._geometryDict['L'].lifeBarGeometry,
            new TransparentMaterial(
                this._textureDict['SLBAR'].cloneMap()
            ).material
        );
    }

    constructSLifeBarBarFX() {
        return new THREE.Mesh(
            this._geometryDict['L'].lifeBarGeometry,
            new AdditiveMaterial(
                this._textureDict['SLBARFX'].cloneMap()
            ).material
        );
    }

    constructSLifeBarBarFXRed() {
        return new THREE.Mesh(
            this._geometryDict['L'].lifeBarGeometry,
            new AdditiveMaterial(
                this._textureDict['SLBARFXRED'].cloneMap()
            ).material
        );
    }
    constructSLifeBarFront() {
        return new THREE.Mesh(
            this._geometryDict['L'].lifeBarGeometry,
            new TransparentMaterial(
                this._textureDict['SLFRONT'].cloneMap()
            ).material
        );
    }

    constructDLifeBarBack() {
        return new THREE.Mesh(
            this._geometryDict['DL'].lifeBarGeometry,
            new TransparentMaterial(
                this._textureDict['DLBACK'].cloneMap()
            ).material
        );
    }

    constructDLifeBarBar() {
        return new THREE.Mesh(
            this._geometryDict['DL'].lifeBarGeometry,
            new TransparentMaterial(
                this._textureDict['DLBAR'].cloneMap()
            ).material
        );
    }

    constructDLifeBarBarFX() {
        return new THREE.Mesh(
            this._geometryDict['DL'].lifeBarGeometry,
            new AdditiveMaterial(
                this._textureDict['DLBARFX'].cloneMap()
            ).material
        );
    }

    constructDLifeBarBarFXRed() {
        return new THREE.Mesh(
            this._geometryDict['DL'].lifeBarGeometry,
            new AdditiveMaterial(
                this._textureDict['DLBARFXRED'].cloneMap()
            ).material
        );
    }
    constructDLifeBarFront() {
        return new THREE.Mesh(
            this._geometryDict['DL'].lifeBarGeometry,
            new TransparentMaterial(
                this._textureDict['DLFRONT'].cloneMap()
            ).material
        );
    }

    constructLifeBarTip() {
        return new THREE.Mesh(
            this._geometryDict['T'].tipGeometry,
            new TransparentMaterial(this._textureDict['LT'].cloneMap()).material
        );
    }

    constructLifeBarPulse() {
        return new THREE.Mesh(
            this._geometryDict['P'].pulseGeometry,
            new TransparentMaterial(this._textureDict['LP'].cloneMap()).material
        );
    }

    constructBackground() {
        return new THREE.Mesh(
            this._geometryDict['B'].backgroundGeometry,
            this._shadersDict['B'].material
        );
    }

    constructGenericTap(noteskinId: string) {
        const tex = this._textureDict['NOTESKINS'][noteskinId]['T'].cloneMap();
        return new THREE.Mesh(
            this._geometryDict['S'].stepGeometry,
            new TransparentMaterial(tex).material
        );
    }

    constructGenericWhiteTap(noteskinId: string) {
        const tex = this._textureDict['NOTESKINS'][noteskinId]['T'].cloneMap();
        return new THREE.Mesh(
            this._geometryDict['S'].stepGeometry,
            new AdditiveMaterial(tex).material
        );
    }

    constructStepBounce(kind: Panels, noteskinId: string) {
        const textureDict = this._textureDict['NOTESKINS'][noteskinId];
        switch (kind) {
            case 'dl':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    new AdditiveMaterial(textureDict['SDL'].cloneMap()).material
                );
                break;
            case 'ul':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    new AdditiveMaterial(textureDict['SUL'].cloneMap()).material
                );
                break;
            case 'c':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    new AdditiveMaterial(textureDict['SC'].cloneMap()).material
                );
                break;
            case 'ur':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    new AdditiveMaterial(textureDict['SUR'].cloneMap()).material
                );
                break;
            case 'dr':
                return new THREE.Mesh(
                    this._geometryDict['S'].stepGeometry,
                    new AdditiveMaterial(textureDict['SDR'].cloneMap()).material
                );
                break;
        }
    }

    constructHoldExtensible(kind: Panels, noteskinId: string) {
        const materialsDict = this._materialsDict['NOTESKINS'][noteskinId];
        switch (kind) {
            case 'dl':
                return new THREE.Mesh(
                    this._geometryDict['H'].holdGeometry,
                    materialsDict['HDL'].material
                );
                break;
            case 'ul':
                return new THREE.Mesh(
                    this._geometryDict['H'].holdGeometry,
                    materialsDict['HUL'].material
                );
                break;
            case 'c':
                return new THREE.Mesh(
                    this._geometryDict['H'].holdGeometry,
                    materialsDict['HC'].material
                );
                break;
            case 'ur':
                return new THREE.Mesh(
                    this._geometryDict['H'].holdGeometry,
                    materialsDict['HUR'].material
                );
                break;
            case 'dr':
                return new THREE.Mesh(
                    this._geometryDict['H'].holdGeometry,
                    materialsDict['HDR'].material
                );
                break;
        }
    }

    constructJudgmentBanner() {
        const tex = this._textureDict['J'].cloneMap();
        return new THREE.Mesh(
            this._geometryDict['J'].judgmentGeometry,
            new TransparentMaterial(tex).material
        );
    }

    constructCombo() {
        return new THREE.Mesh(
            this._geometryDict['C'].comboGeometry,
            new TransparentMaterial(this._textureDict['C'].cloneMap()).material
        );
    }

    constructDigit() {
        return new THREE.Mesh(
            this._geometryDict['D'].digitGeometry,
            new TransparentMaterial(this._textureDict['DN'].cloneMap()).material
        );
    }

    constructReceptor(noteskinId: string) {
        const texture =
            this._textureDict['NOTESKINS'][noteskinId]['R'].cloneMap();
        return new THREE.Mesh(
            this._geometryDict['R'].receptorGeometry,
            new ReceptorMaterial(texture, this.resourcePath).material
        );
    }

    constructExplosion(noteskinId: string) {
        return new THREE.Mesh(
            this._geometryDict['S'].stepGeometry,
            new AdditiveMaterial(
                this._textureDict['NOTESKINS'][noteskinId]['FX'].cloneMap()
            ).material
        );
    }

    getStepNoteTexture(kind: Panels, noteskinId: string) {
        let texture;
        const textureDict = this._textureDict['NOTESKINS'][noteskinId];

        switch (kind) {
            case 'dl':
                texture = textureDict['SDL'].map;
                break;
            case 'ul':
                texture = textureDict['SUL'].map;
                break;
            case 'c':
                texture = textureDict['SC'].map;
                break;
            case 'ur':
                texture = textureDict['SUR'].map;
                break;
            case 'dr':
                texture = textureDict['SDR'].map;
                break;
        }

        return texture;
    }

    getHoldExtensibleTexture(kind: Panels, noteskinId: string) {
        let texture;
        const textureDict = this._textureDict['NOTESKINS'][noteskinId];
        switch (kind) {
            case 'dl':
                texture = textureDict['HDL'].map;
                break;
            case 'ul':
                texture = textureDict['HUL'].map;
                break;
            case 'c':
                texture = textureDict['HC'].map;
                break;
            case 'ur':
                texture = textureDict['HUR'].map;
                break;
            case 'dr':
                texture = textureDict['HDR'].map;
                break;
        }

        return texture;
    }
}

export { ResourceManager };
