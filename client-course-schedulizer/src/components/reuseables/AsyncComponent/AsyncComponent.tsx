import React, { PropsWithChildren } from "react";

interface AsyncComponent {
  isLoading: boolean;
}

/*
  Show a loading state while waiting on a async function to finish.
*/
export const AsyncComponent = ({ isLoading, children }: PropsWithChildren<AsyncComponent>) => {
  return <>{isLoading ? <div>parsing csv...</div> : <>{children}</>}</>;
};
