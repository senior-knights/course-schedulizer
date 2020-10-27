import { Box, Grid, Paper, Tab, Tabs as MUITabs, Typography } from "@material-ui/core";
import React, { ChangeEvent, PropsWithChildren, useState } from "react";
import { Calendar } from "../reuseables/Calendar";
import { ScheduleToolbar } from "../Toolbar/ScheduleToolbar";
import "./Tabs.scss";

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

// TODO: remove this
const professors = ["Norman", "Adams", "VanderLinden", "Arnold", "Bailey"];

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
        <ScheduleToolbar />
        <Grid alignItems="flex-start" container direction="row" justify="flex-start">
          {professors.map((prof) => {
            return (
              <div key={prof} style={{ width: 500 }}>
                <h3>{prof}</h3>
                <Calendar key={prof} />
              </div>
            );
          })}
        </Grid>
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
