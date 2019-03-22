import Soukai, { definitionsFromContext } from 'soukai';

import { SolidEngine } from 'soukai-solid';

Soukai.useEngine(new SolidEngine());

Soukai.loadModels(definitionsFromContext(require.context('@/models/soukai/')));
