import { memo } from '@noeldemartin/utils';

export default function prefersReducedMotion(): boolean {
    return memo('prefers-reduced-motion', () => window.matchMedia('(prefers-reduced-motion)').matches);
}
