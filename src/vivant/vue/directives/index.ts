import { required, stringMatch } from '@noeldemartin/utils';
import type { Directive } from 'vue';

const directivesGlob = import.meta.glob(['./*.ts'], { eager: true }) as Record<string, { default: Directive }>;

const directives: Record<string, Directive> = {};

for (const [fileName, moduleExports] of Object.entries(directivesGlob)) {
    const name = required(stringMatch<3>(fileName, /^(.*\/)?(.+)\.ts$/))[2];

    directives[name] = moduleExports.default;
}

export default directives;
