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

import { Engine } from 'src/Engine';
import { ResourceManager } from 'src/Resources/ResourceManager';

export class GameObject {
    constructor(
        private _resourceManager: ResourceManager,
        public engine: Engine
    ) {
        engine.addToUpdateList(this);
    }

    ready() {
        // noop
    }

    update(delta: number) {
        // noop
    }
}
