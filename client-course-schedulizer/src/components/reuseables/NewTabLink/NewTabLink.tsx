import { Link } from "@material-ui/core";
import React, { PropsWithChildren } from "react";

type NewTabLink = Pick<HTMLAnchorElement, "href">;

/* Opens a link in a new tab. Useful for referencing pages outside of the app */
// Turned off "eslint/no-redeclare" and "eslint/no-unused-vars"
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const NewTabLink = ({ children, href }: PropsWithChildren<NewTabLink>) => { // eslint-disable-line @typescript-eslint/no-unused-vars
  return (
    <Link href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </Link>
  );
};
