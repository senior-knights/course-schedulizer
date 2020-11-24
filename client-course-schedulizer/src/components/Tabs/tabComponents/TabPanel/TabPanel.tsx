import { Box, Typography } from "@material-ui/core";
import React, { PropsWithChildren } from "react";

interface TabPanelProps {
  index: number;
  value: number;
}

/* TabPanel displays the content of a selected tab */
export const TabPanel = (props: PropsWithChildren<TabPanelProps>) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      aria-labelledby={`simple-tab-${index}`}
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      role="tabpanel"
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
};
