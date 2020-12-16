/* Referenced: https://codesandbox.io/embed/rj998k4vmm */

/* Calculates the y, x, and scale for the transformation. */
export const calc = (x: number, y: number) => {
  // TODO: This makes only things in the center perfectly transform.
  // I can't figure out the math to fix this yet
  // Need to offset for where the div is placed on the screen.
  return [-(y - window.innerHeight / 2) / 50, (x - window.innerWidth / 2) / 50, 1.1];
};

/* Transforms the image */
export const trans = (x: number, y: number, s: number): string => {
  return `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;
};
