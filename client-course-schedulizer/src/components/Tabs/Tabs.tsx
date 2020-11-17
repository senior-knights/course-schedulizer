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
  const {
    appState: { schedule },
    isCSVLoading,
  } = useContext(AppContext);

  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <AsyncComponent isLoading={isCSVLoading}>
      <AsyncComponent.Loading>Parsing CSV...</AsyncComponent.Loading>
      <AsyncComponent.Loaded>
        {schedule.courses.length === 0 ? (
          <>
            <h2>No schedule selected. Please import a CSV or add a section to start Editing.</h2>
            {/* TODO: Fix this. This importButton styling is very weird, and it padding is odd. */}
            <ImportButton className="import-button MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary" />
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
              <RoomsSchedule />
            </TabPanel>
            <TabPanel index={2} value={tabValue}>
              <FacultyLoads />
            </TabPanel>
            <TabPanel index={3} value={tabValue}>
              Item Four
            </TabPanel>
          </>
        )}
      </AsyncComponent.Loaded>
    </AsyncComponent>
  );
};
