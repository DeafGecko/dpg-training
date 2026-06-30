// Groups your flat JSON into: { "Jesus Foundation": [story1, story2], ... }
/**
 * Splits comma-separated strings into clean arrays and removes whitespace.
 * Returns an empty array if the input is null or undefined.
 */
export const parseMediaString = (mediaString: string | null | undefined): string[] => {
      if (!mediaString) return [];
      
      return mediaString
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
};
