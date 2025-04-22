import tailwindColors from 'tailwindcss/colors';

const elementColorVariables = new WeakMap<HTMLElement, string[] | boolean>();

const COLOR_SHADES = [
    tailwindColors.amber,
    tailwindColors.red,
    tailwindColors.sky,
    tailwindColors.emerald,
    tailwindColors.purple,
    tailwindColors.pink,
];

export const DEFAULT_COLOR = tailwindColors.sky['600'];
export const COLORS = COLOR_SHADES.map((shades) => shades['600']);

export function setThemeVariables(element: HTMLElement, color: string): void {
    clearThemeVariables(element);

    const colors = COLOR_SHADES.find((values) => values['600'] === color);

    if (!colors) {
        element.style.setProperty('--color-primary', color);
        elementColorVariables.set(element, true);

        return;
    }

    Object.entries(colors).forEach(([name, value]) => {
        element.style.setProperty(`--color-primary-${name}`, value);
    });

    elementColorVariables.set(element, Object.keys(colors));
}

export function clearThemeVariables(element: HTMLElement): void {
    const colorVariables = elementColorVariables.get(element) ?? [];

    if (colorVariables === true) {
        element.style.removeProperty('--color-primary');
    } else {
        Object.keys(colorVariables).forEach((name) => {
            element.style.removeProperty(`--color-primary-${name}`);
        });
    }

    elementColorVariables.delete(element);
}
