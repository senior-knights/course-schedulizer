import { Box, Tabs as MUITabs, Tab, Typography } from "@material-ui/core";
import React, { ChangeEvent, PropsWithChildren, useContext, useState } from "react";
import { FacultySchedule } from "./FacultySchedule";
import "./Tabs.scss";
import { AppContext } from "../../utilities/services/appContext";
import { AddSectionButton } from "../reuseables/AddSectionButton";
import { AsyncComponent } from "../reuseables/AsyncComponent";
import { FacultyLoads } from "./FacultyLoads";
import { RoomsSchedule } from "./RoomsSchedule";
import { ImportButton } from "../Header/ImportButton";

interface TabPanelProps {
  index: number;
  value: number;
}

/* A navigator between the different features of the app */
export const Tabs = () => {
  const DEFAULT_TAB = 0;
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

/* Display information when schedule has no courses. */
const NoCoursesHeader = () => {
  return (
    <>
      <h2>No schedule data.</h2>
      <p>
        Please import a CSV of an existing schedule or start building the schedule from scratch by
        adding your first section.
      </p>
      {/* TODO: Fix this. This importButton styling is very weird, and it padding is odd. */}
      <ImportButton className="import-button MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary" />
      <AddSectionButton isIcon={false} />
    </>
  );
};

/* TabPanel displays the content of a selected tab */
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
