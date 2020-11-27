import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, InputAdornment, Typography } from "@material-ui/core";
import { GridItemCheckboxGroup, GridItemRadioGroup, GridItemTextField } from "components";
import React, { ChangeEvent, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AppContext } from "utilities/contexts";
import {
  Day,
  Half,
  Intensive,
  SemesterLength,
  SemesterLengthOption,
  Term,
  Weekday,
} from "utilities/interfaces";
import "./AddSectionPopover.scss";
import {
  addSectionSchema,
  SectionInput,
  updateScheduleWithNewSection,
} from "./AddSectionPopoverService";

const SPACING = 2;

/* A form to input information to add a schedule */
export const AddSectionPopover = () => {
  // hooks
  const {
    appState: { schedule },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);
  const hookForm = useForm<SectionInput>({
    criteriaMode: "all",
    resolver: yupResolver(addSectionSchema),
  });
  const [semesterLength, setSemesterLength] = useState<SemesterLengthOption>(
    SemesterLengthOption.FullSemester,
  );

  // handlers
  const onSubmit = (data: SectionInput) => {
    setIsCSVLoading(true);
    updateScheduleWithNewSection(data, schedule);
    appDispatch({ payload: { schedule }, type: "setScheduleData" });
    setIsCSVLoading(false);
  };
  const onSemesterLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSemesterLength(e.target.value as SemesterLengthOption);
  };

  // const vars
  const { register, handleSubmit, control } = hookForm;
  const isHalfSemester = semesterLength === SemesterLengthOption.HalfSemester;
  const isIntensiveSemester = semesterLength === SemesterLengthOption.IntensiveSemester;
  const isCustomSemester = semesterLength === SemesterLengthOption.CustomSemester;

  return (
    <form className="popover-container" onSubmit={handleSubmit(onSubmit)}>
      <Box mb={SPACING}>
        <Typography className="popover-title" variant="h4">
          Add Section
        </Typography>
      </Box>
      <Grid container spacing={SPACING}>
        {/* TODO: Dropdown for courses already in system */}
        <GridItemTextField
          hookForm={hookForm}
          label="Prefix"
          textFieldProps={{ autoFocus: true }}
        />
        <GridItemTextField hookForm={hookForm} label="Number" />
        <GridItemTextField hookForm={hookForm} label="Section" />
        <GridItemTextField hookForm={hookForm} label="Course Name" />
        <Grid item xs>
          <span>{/* TODO: add error messages? */}</span>
        </Grid>
      </Grid>
      <Grid container spacing={SPACING}>
        {/* TODO: Dropdown for instructors with option to add new one */}
        <GridItemTextField hookForm={hookForm} label="Instructor" />
        <GridItemTextField hookForm={hookForm} label="Student Hours" />
        <GridItemTextField hookForm={hookForm} label="Faculty Hours" />
        {/* TODO: Dropdown for rooms with option to add new one */}
        <GridItemTextField hookForm={hookForm} label="Location" />
        <GridItemTextField hookForm={hookForm} label="Room Capacity" />
      </Grid>
      <Grid container spacing={SPACING}>
        <GridItemTextField hookForm={hookForm} label="Anticipated Size" />
        <GridItemTextField hookForm={hookForm} label="Global Max" />
        <GridItemTextField hookForm={hookForm} label="Local Max" />
        <GridItemTextField
          hookForm={hookForm}
          label="Start Time"
          textFieldProps={{
            defaultValue: "08:00",
            fullWidth: true,
            type: "time",
          }}
        />
        <GridItemTextField
          hookForm={hookForm}
          label="Duration"
          textFieldProps={{
            InputProps: {
              endAdornment: <InputAdornment position="end">min</InputAdornment>,
            },
          }}
        />
      </Grid>
      <Grid container spacing={SPACING}>
        <GridItemCheckboxGroup
          hookForm={hookForm}
          label="Days"
          options={Object.values(Day).filter((day) => {
            return Object.values(Weekday).includes(day);
          })}
        />
        <GridItemRadioGroup
          control={control}
          defaultValue={Term.Fall}
          label="Term"
          options={Object.values(Term)}
          register={register}
        />
        <GridItemRadioGroup
          control={control}
          defaultValue={SemesterLengthOption.FullSemester}
          label="Semester Length"
          onChange={onSemesterLengthChange}
          options={Object.values(SemesterLengthOption)}
          register={register}
        />
        <Grid item xs>
          {isHalfSemester && (
            <GridItemRadioGroup
              control={control}
              defaultValue={SemesterLength.HalfFirst}
              label="Half Semester"
              options={Object.values(SemesterLength).filter((h) => {
                return Object.values(Half).includes(h);
              })}
              register={register}
            />
          )}
          {isIntensiveSemester && (
            <GridItemRadioGroup
              control={control}
              defaultValue={SemesterLength.IntensiveA}
              label="Intensive Semester"
              options={Object.values(SemesterLength).filter((i) => {
                return Object.values(Intensive).includes(i);
              })}
              register={register}
            />
          )}
          {isCustomSemester && (
            <Grid container direction="column" spacing={SPACING}>
              {/* TODO: add support for custom */}
              <GridItemTextField
                hookForm={hookForm}
                label="Start Date"
                textFieldProps={{
                  defaultValue: "2020-20-20",
                  disabled: true,
                  fullWidth: true,
                  // type: "date",
                }}
              />
              <GridItemTextField
                hookForm={hookForm}
                label="End Date"
                textFieldProps={{
                  defaultValue: "2020-20-20",
                  disabled: true,
                  // type: "date",
                }}
              />
              <Typography variant="caption">
                Custom semester lengths are not support yet.
              </Typography>
            </Grid>
          )}
        </Grid>
        <GridItemTextField
          hookForm={hookForm}
          label="Notes"
          textFieldProps={{ multiline: true, name: "comments", rows: 4 }}
        />
      </Grid>
      <Grid alignItems="flex-end" container justify="space-between">
        <Grid item>
          <Typography variant="caption">
            Tip: use <b>tab</b> and <b>shift + tab</b> to navigate, <b>space bar</b> to select days,{" "}
            <b>arrow keys</b> to select term and others, and <b>return</b> to submit.
          </Typography>
        </Grid>
        <Grid item>
          <Button color="primary" type="submit" variant="contained">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
