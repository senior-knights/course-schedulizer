import { Container, Tabs as MUITabs, Tab } from "@material-ui/core";
import React, { ChangeEvent, useContext, useState } from "react";
import { FacultySchedule } from "./FacultySchedule";
import "./Tabs.scss";
import { AppContext } from "../../utilities/services/appContext";
import { AsyncComponent } from "../reuseables/AsyncComponent";
import { FacultyLoads } from "./FacultyLoads";
import { RoomsSchedule } from "./RoomsSchedule";
import { CSVActions, NoCoursesHeader, TabPanel } from "./tabComponents";

const DEFAULT_TAB = 0;

/* A navigator between the different features of the app */
export const Tabs = () => {
  const [tabValue, setTabValue] = useState(DEFAULT_TAB);
  const {
    appState: { schedule },
    isCSVLoading,
  } = useContext(AppContext);

  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
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
              <FacultyLoads />
            </TabPanel>
            <TabPanel index={3} value={tabValue}>
              Item Four
            </TabPanel>
          </>
        ) : (
          <NoCoursesHeader />
        )}
      </AsyncComponent.Loaded>
    </AsyncComponent>
  );
};
