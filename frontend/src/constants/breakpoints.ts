/** Desktop layout is used at this width and above (1920×1080 target). */
export const DESKTOP_MIN_WIDTH = 1024;

/** Mobile layout applies below desktop minimum (iPhone 15 portrait ~393px). */
export const MOBILE_MAX_WIDTH = DESKTOP_MIN_WIDTH - 1;

export const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_MAX_WIDTH}px)`;
export const DESKTOP_MEDIA_QUERY = `(min-width: ${DESKTOP_MIN_WIDTH}px)`;
