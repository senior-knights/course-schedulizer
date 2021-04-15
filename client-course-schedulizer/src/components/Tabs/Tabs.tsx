import { Container, Tab, Tabs as MUITabs, Typography } from "@material-ui/core";
import { AsyncComponent } from "components";
import { DepartmentSchedule, FacultyLoads, FacultySchedule, RoomsSchedule } from "components/Tabs";
import React, { ChangeEvent, useContext, useState } from "react";
import { AppContext } from "utilities/contexts";
import { SchedulizerTab } from "utilities/interfaces";
import { CSVActions, NoCoursesHeader, TabPanel } from "./tabComponents";
import "./Tabs.scss";

/* A navigator between the different features of the app */
export const Tabs = () => {
  const {
    appState: { schedule, schedulizerTab },
    isCSVLoading,
    appDispatch,
  } = useContext(AppContext);
  const [tabValue, setTabValue] = useState(schedulizerTab || 0);

  const handleTabChange = (event: ChangeEvent<{}>, newValue: SchedulizerTab) => {
    setTabValue(newValue);
    appDispatch({ payload: { schedulizerTab: newValue }, type: "setSchedulizerTab" });
  };

  const scheduleHasCourses = schedule.courses.length > 0;

  return (
    <AsyncComponent isLoading={isCSVLoading}>
      <AsyncComponent.Loading>Parsing CSV...</AsyncComponent.Loading>
      <AsyncComponent.Loaded>
        {scheduleHasCourses ? (
          <>
            <Container className="schedulizer-header" maxWidth={false}>
              <CSVActions />

              <MUITabs
                centered
                indicatorColor="primary"
                onChange={handleTabChange}
                textColor="primary"
                value={tabValue}
              >
                <Tab label="Faculty Schedule" />
                <Tab label="Room Schedule" />
                <Tab label="Dept Schedule" />
                <Tab label="Teaching Loads" />
                <Tab label="Conflicts" />
              </MUITabs>
              <span>{/* Empty */}</span>
            </Container>
            <TabPanel index={0} value={tabValue}>
              <FacultySchedule />
            </TabPanel>
            <TabPanel index={1} value={tabValue}>
              <RoomsSchedule />
            </TabPanel>
            <TabPanel index={2} value={tabValue}>
              <DepartmentSchedule />
            </TabPanel>
            <TabPanel index={3} value={tabValue}>
              <FacultyLoads />
            </TabPanel>
            <TabPanel index={4} value={tabValue}>
              <Typography>The conflicts tab is not supported yet.</Typography>
            </TabPanel>
          </>
        ) : (
          <NoCoursesHeader />
        )}
      </AsyncComponent.Loaded>
    </AsyncComponent>
  );
};
