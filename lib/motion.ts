/** Shared motion tokens — mirrors --ease-out-expo / --duration-rise in globals.css. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_PRESENCE = EASE_OUT_EXPO;
export const DURATION_REVEAL = 0.56;
export const REVEAL_VIEWPORT = { once: true, amount: 0.12 } as const;
