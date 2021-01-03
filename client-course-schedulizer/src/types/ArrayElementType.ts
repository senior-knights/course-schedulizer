/* Get the type of element for an array.
ref: https://stackoverflow.com/a/57447842/9931154
*/
export type ArrayElementType<A> = A extends readonly (infer T)[] ? T : never;
