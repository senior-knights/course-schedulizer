export const enumArray = <T>(e: T) => {
  return Object.keys(e).map((val) => {
    return e[val as keyof typeof e];
  });
};
