export const Fills = {
    None: 'none',
    Forwards: 'forwards',
} as const;

export type Fill = (typeof Fills)[keyof typeof Fills];
