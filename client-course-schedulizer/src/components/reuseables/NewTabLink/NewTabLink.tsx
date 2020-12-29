import { Link } from "@material-ui/core";
import React, { PropsWithChildren } from "react";

type NewTabLink = Pick<HTMLAnchorElement, "href">;

/* Opens a link in a new tab. Useful for referencing pages outside of the app */
export const NewTabLink = ({ children, href }: PropsWithChildren<NewTabLink>) => {
  return (
    <Link href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </Link>
  );
};
