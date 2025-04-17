import React, { FC, PropsWithChildren } from "react";
import { Literal, Static, Union } from "runtypes";
import { createFC, getElements } from "utilities";

interface AsyncComponent {
  isLoading: boolean;
}

// Define the runtype
const SubComponents = Union(Literal("Loading"), Literal("Loaded"));

// Some boiler plate to get useable types.
// eslint-disable-next-line @typescript-eslint/no-redeclare
type SubComponents = Static<typeof SubComponents>;
type AsyncSubComponents = { [key in SubComponents]: FC<{}> };

/*
  Show a loading state while waiting on a async function to finish.

  Usage:
  <AsyncComponent isLoading={boolean}>
    <AsyncComponent.Loading>
      content to display while loading
    </AsyncComponent.Loading>
    <AsyncComponent.Loaded>
      content to display when loading is complete
    </AsyncComponent.Loaded>
  </AsyncComponent>

  References:
    - https://stackoverflow.com/a/56953600/9931154
    - https://dev.to/shayanypn/buckle-with-react-sub-component-10ll
*/

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AsyncComponent: FC<AsyncComponent> & AsyncSubComponents = ({
  children,
  isLoading,
}: PropsWithChildren<AsyncComponent>) => {
  const { Loading, Loaded } = getElements(children, SubComponents);

  return <>{isLoading ? <>{Loading}</> : <>{Loaded}</>}</>;
};

// Define sub-components.
AsyncComponent.Loading = createFC("Loading");
AsyncComponent.Loaded = createFC("Loaded");
