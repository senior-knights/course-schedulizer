import { Box } from "@material-ui/core";
import { AnimateShowAndHide } from "components";
import React, { ReactNode } from "react";

interface TextSection {
  body?: ReactNode;
  title?: ReactNode;
}

/* Display a header with content. Used on About Page */
export const TextSection = ({ title, body }: TextSection) => {
  return (
    <Box mb={9} mt={3}>
      <AnimateShowAndHide>{title}</AnimateShowAndHide>
      <>{body}</>
    </Box>
  );
};

TextSection.defaultProps = {
  body: undefined,
  title: undefined,
};
