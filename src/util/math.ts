export const Random = {
  valueInRange: (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  },
  intInRange: (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  arrayItem: <T>(array: T[]) => {
    return array[Random.intInRange(0, array.length - 1)];
  },
};

export function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max));
}
