import { Box, Tabs as MUITabs, Paper, Tab, Typography } from "@material-ui/core";
import React, { ChangeEvent, PropsWithChildren, useContext, useState } from "react";
import { FacultySchedule } from "./FacultySchedule";
import { ScheduleToolbar } from "../Toolbar/ScheduleToolbar";
import "./Tabs.scss";
import { ScheduleContext } from "../../utilities/services/context";
import { AddSectionButton } from "../reuseables/AddSectionButton";
import { AsyncComponent } from "../reuseables/AsyncComponent";

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
  const { schedule, isLoading } = useContext(ScheduleContext);

  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Paper>
      <AsyncComponent isLoading={isLoading}>
        <>
          {schedule.courses.length === 0 ? (
            <>
              <h2>No schedule selected. Please import a CSV to start Editing.</h2>
              <AddSectionButton isIcon={false} />
            </>
          ) : (
            <>
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
                Item Three
              </TabPanel>
              <TabPanel index={3} value={tabValue}>
                Item Four
              </TabPanel>
            </>
          )}
        </>
      </AsyncComponent>
    </Paper>
  );
};
