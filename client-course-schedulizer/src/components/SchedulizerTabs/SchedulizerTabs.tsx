import { Box, Paper, Tab, Tabs, Typography } from "@material-ui/core";
import React, { ChangeEvent, PropsWithChildren, useState } from "react";
import { ScheduleToolbar } from "../ScheduleToolbar";
import "./SchedulizerTabs.scss";

interface TabPanelProps {
  index: number;
  value: number;
}

const TabPanel = (props: PropsWithChildren<TabPanelProps>) => {
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

export const SchedulizerTabs = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Paper>
      <Tabs
        centered
        indicatorColor="primary"
        onChange={handleTabChange}
        textColor="primary"
        value={tabValue}
      >
        <Tab label="Faculty Schedule" />
        <Tab label="Room Schedule" />
        <Tab label="Teaching Loads" />
        <Tab label="Conflicts" />
      </Tabs>
      <TabPanel index={0} value={tabValue}>
        <ScheduleToolbar />
      </TabPanel>
      <TabPanel index={1} value={tabValue}>
        <ScheduleToolbar />
      </TabPanel>
      <TabPanel index={2} value={tabValue}>
        Item Three
      </TabPanel>
      <TabPanel index={3} value={tabValue}>
        Item Four
      </TabPanel>
    </Paper>
  );
};