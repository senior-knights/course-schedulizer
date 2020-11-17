/* Create an iterable from an enumeration */
export const enumArray = <T>(e: T) => {
  return Object.keys(e).map((val) => {
    return e[val as keyof typeof e];
  });
};

/* a no-op fn used for default values */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const voidFn = () => {};
