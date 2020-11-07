import { Box, Tabs as MUITabs, Paper, Tab, Typography } from "@material-ui/core";
import React, { ChangeEvent, PropsWithChildren, useState } from "react";
import { FacultySchedule } from "./FacultySchedule";
import { ScheduleToolbar } from "../Toolbar/ScheduleToolbar";
import "./Tabs.scss";
import { FacultyLoads } from "./FacultyLoads";

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

export const Tabs = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Paper>
      <MUITabs
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
      </MUITabs>
      <TabPanel index={0} value={tabValue}>
        <FacultySchedule />
      </TabPanel>
      <TabPanel index={1} value={tabValue}>
        <ScheduleToolbar />
      </TabPanel>
      <TabPanel index={2} value={tabValue}>
        <FacultyLoads />
      </TabPanel>
      <TabPanel index={3} value={tabValue}>
        Item Four
      </TabPanel>
    </Paper>
  );
};
