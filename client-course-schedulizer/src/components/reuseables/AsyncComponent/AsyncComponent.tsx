/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: fix this

import React, { PropsWithChildren, FC } from "react";

interface AsyncComponent {
  isLoading: boolean;
}

interface AsyncSubComponents {
  Loaded: FC<{}>;
  Loading: FC<{}>;
}

/*
  Show a loading state while waiting on a async function to finish.
  Referenced:
    - https://stackoverflow.com/a/56953600/9931154
    - https://dev.to/shayanypn/buckle-with-react-sub-component-10ll
*/
export const AsyncComponent: FC<AsyncComponent> & AsyncSubComponents = ({
  children,
  isLoading,
}: PropsWithChildren<AsyncComponent>) => {
  const loadedNode = React.Children.map(children, (child: any) => {
    return child?.type.displayName === "Loaded" ? child : null;
  });
  const loadingNode = React.Children.map(children, (child: any) => {
    return child?.type.displayName === "Loading" ? child : null;
  });
  return <>{isLoading ? <>{loadingNode}</> : <>{loadedNode}</>}</>;
};

const Loading: FC<{}> = (props) => {
  return <div {...props} />;
};
Loading.displayName = "Loading";
AsyncComponent.Loading = Loading;

const Loaded: FC<{}> = (props) => {
  return <div {...props} />;
};
Loaded.displayName = "Loaded";
AsyncComponent.Loaded = Loaded;
