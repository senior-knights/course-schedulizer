import React, { PropsWithChildren } from "react";

export const Page = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div style={{ display: "flex", height: "100%", justifyContent: "center", padding: "1em" }}>
      <div style={{ maxWidth: 900, textAlign: "left", width: 900 }}>{children}</div>
    </div>
  );
};
