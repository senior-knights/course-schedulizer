import { Children, ReactNode } from "react";

/* Create an iterable from an enumeration */
export const enumArray = <T>(e: T) => {
  return Object.keys(e).map((val) => {
    return e[val as keyof typeof e];
  });
};

/* a no-op fn used for default values */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const voidFn = () => {};

/* Method of getting a child component by their display name.
  Used in sub-components.
*/
export const getChildByName = (children: ReactNode, displayName: string) => {
  return Children.map(children as JSX.Element[], (child: JSX.Element) => {
    return child?.type.displayName === displayName ? child : null;
  });
};
