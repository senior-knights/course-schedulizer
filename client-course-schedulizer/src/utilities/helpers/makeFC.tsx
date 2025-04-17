import React, { ComponentProps, ElementType, FC, forwardRef, ReactNode } from "react";
import { getChildByName } from "utilities";

/* Options props to pass when creating a component. */
interface ComponentOptions<T extends ElementType = "div"> {
  Component?: T;
  defaultProps?: Partial<ComponentProps<T>>;
  displayName?: string;
}

/*
This function will create a "pass-through" component. It is used to create
  sub-components that return its children so the parent component and arrange those children.
  The parent affectively can employ "middleware" between the child component JSX and the JSX that is
  rendered. This function was originally from from React-Bootstrap which has been modified under their
  MIT license.
Ref: https://github.com/react-bootstrap/react-bootstrap/blob/072e7c5fb01b492735a9db2409909058a9976190/src/createWithBsPrefix.tsx#L16
*/
export const createFC = <T extends ElementType = "div">(
  prefix: string,
  { displayName = prefix, Component, defaultProps }: ComponentOptions<T> = {},
): FC<{}> => {
  const subComponent = forwardRef(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ className, as: Tag = Component || "div", ...props }: any, ref) => {
      return <Tag className={`${className}`} ref={ref} {...props} />;
    },
  );
  subComponent.defaultProps = defaultProps;
  subComponent.displayName = displayName;
  return subComponent as FC<{}>;
};

type Alternatives = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  alternatives?: any;
};

/*
Returns an iterable from a "runtypes" union.
Ref: https://github.com/microsoft/TypeScript/issues/13542#issuecomment-282762530
*/
const getUnionTypeIterable = <T extends Alternatives>(type: T): string[] => {
  return type.alternatives.map((literal: { value: string }) => {
    return literal.value;
  });
};

type Elements<T extends string> = { [key in T]?: JSX.Element };

/* This gets the JSX.Elements from the children of a component and return them in an object
Ref: https://stackoverflow.com/questions/53813188/how-can-i-cast-custom-type-to-primitive-type
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getElements = <T extends string>(children: ReactNode, type: any) => {
  const elements: Elements<T> = {};
  getUnionTypeIterable<T & Alternatives>(type).forEach((it: string) => {
    // eslint-disable-next-line prefer-destructuring
    elements[(it as unknown) as T] = getChildByName(children, it)[0];
  });
  return elements;
};
