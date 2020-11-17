import React, { PropsWithChildren, FC, ReactNode } from "react";

interface AsyncComponent {
  isLoading: boolean;
}

type SubComponents = "Loading" | "Loaded";
type AsyncSubComponents = { [key in SubComponents]: FC<{}> };

const getSubComponent = (children: ReactNode, displayName: string) => {
  return React.Children.map(children as JSX.Element[], (child: JSX.Element) => {
    return child?.type.displayName === displayName ? child : null;
  });
};

/*
  Show a loading state while waiting on a async function to finish.
  References:
    - https://stackoverflow.com/a/56953600/9931154
    - https://dev.to/shayanypn/buckle-with-react-sub-component-10ll
*/
export const AsyncComponent: FC<AsyncComponent> & AsyncSubComponents = ({
  children,
  isLoading,
}: PropsWithChildren<AsyncComponent>) => {
  // TODO: better way to get all of the children? Loop?
  const loadedNode = getSubComponent(children, "Loaded");
  const loadingNode = getSubComponent(children, "Loading");

  return <>{isLoading ? <>{loadingNode}</> : <>{loadedNode}</>}</>;
};

const Loading: FC<{}> = ({ children }: PropsWithChildren<{}>) => {
  return <>{children}</>;
};
Loading.displayName = "Loading";
AsyncComponent.Loading = Loading;

const Loaded: FC<{}> = ({ children }: PropsWithChildren<{}>) => {
  return <>{children}</>;
};
Loaded.displayName = "Loaded";
AsyncComponent.Loaded = Loaded;

/// TODO: some work trying to make this easier to update. I think I'm close but couldn't get it to work.
// https://gitlab.com/cdaringe/react-auto-subcomponent

// AsyncComponent.displayName = "AsyncComponent";
// AsyncComponent.defaultProps = {
//   displayName: "AsyncComponent",
//   isLoading: false,
// };

// const makeSubComp = <T extends object, K extends keyof T & string>(
//   Component: AsyncComponent,
//   subCompName: K,
// ) => {
//   const SubComp: FC<{}> = ({ children }: PropsWithChildren<{}>) => {
//     return <>{children}</>;
//   };
//   return new Proxy(Component, {
//     get: function handleGetAutoComponent(obj, prop) {
//       const ChildComponent = SubComp;
//       ChildComponent.displayName = `${Component.displayName}.${ChildComponent.displayName}`;
//       return ChildComponent;
//     },
//   });
// };

// AsyncComponent = makeSubComp(AsyncComponent, "Loading");
// AsyncComponent = makeSubComp(AsyncComponent, "Loaded");
