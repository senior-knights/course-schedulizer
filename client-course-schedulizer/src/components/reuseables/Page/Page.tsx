import React, { PropsWithChildren } from "react";
import "./Page.scss";

export const Page = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="Page">
      <div className="content">{children}</div>
    </div>
  );
};
