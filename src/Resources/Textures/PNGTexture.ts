import * as THREE from 'three';

export class PNGTexture {
    private _map: THREE.Texture;

    clonedTextures: THREE.Texture[] = [];

    constructor(public renderer: THREE.WebGLRenderer, texturePath: string) {
        const clonedTexturesLocal = this.clonedTextures;
        const mapLocal = new THREE.TextureLoader().load(
            texturePath,
            function () {
                for (const map of clonedTexturesLocal) {
                    map.image = mapLocal.image;
                    map.needsUpdate = true;
                    renderer.initTexture(map);
                }
            }
        );

        this._map = mapLocal;

        // to accurately represent the colors
        this._map.encoding = THREE.sRGBEncoding;

        this._map.wrapS = THREE.RepeatWrapping;

        renderer.initTexture(this._map);
    }

    get map() {
        return this._map;
    }

    cloneMap() {
        const cloned = this._map.clone();
        this.clonedTextures.push(cloned);
        cloned.needsUpdate = true;
        return cloned;
    }
}
