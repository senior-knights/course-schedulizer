import {
  Box,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { ChangeEvent, PropsWithChildren, useState } from "react";
import { Header } from "../Header/Header";
import "./App.scss";

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
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export const App = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="App">
      <Header />
      <Paper>
        <Tabs
          centered
          indicatorColor="primary"
          onChange={handleChange}
          textColor="primary"
          value={value}
        >
          <Tab label="Faculty Schedule" />
          <Tab label="Room Schedule" />
          <Tab label="Teaching Loads" />
          <Tab label="Conflicts" />
        </Tabs>
        <TabPanel index={0} value={value}>
          <div style={{ display: "flex" }}>
            <Autocomplete
              getOptionLabel={(option) => {
                return `${option.name}-${option.section}`;
              }}
              id="combo-box-demo"
              options={classes}
              renderInput={(params) => {
                return <TextField {...params} label="Combo box" variant="outlined" />;
              }}
              style={{ width: 300 }}
            />
            <InputLabel id="label">Color By</InputLabel>
            <Select id="select" labelId="label" value="20">
              <MenuItem value="10">Level</MenuItem>
              <MenuItem value="20">Room</MenuItem>
              <MenuItem value="30">Instructor</MenuItem>
              <MenuItem value="40">Prefix</MenuItem>
            </Select>
          </div>
        </TabPanel>
        <TabPanel index={1} value={value}>
          Item Two
        </TabPanel>
        <TabPanel index={2} value={value}>
          Item Three
        </TabPanel>
        <TabPanel index={3} value={value}>
          Item Four
        </TabPanel>
      </Paper>
    </div>
  );
};

const classes = [
  { instructor: "Victor T. Norman", name: "CS-108", section: "A" },
  { instructor: "Victor T. Norman", name: "CS-108", section: "B" },
  { instructor: "Joel Adams", name: "CS-112", section: "A" },
];
