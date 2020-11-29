import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, InputAdornment, Typography } from "@material-ui/core";
import { GridItemCheckboxGroup, GridItemRadioGroup, GridItemTextField } from "components";
import React, { ChangeEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
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
  useAddSectionToSchedule,
} from "./AddSectionPopoverService";

const SPACING = 2;

/* A form to input information to add a schedule */
export const AddSectionPopover = () => {
  // hooks
  const methods = useForm<SectionInput>({
    criteriaMode: "all",
    resolver: yupResolver(addSectionSchema),
  });
  const [semesterLength, setSemesterLength] = useState<SemesterLengthOption>(
    SemesterLengthOption.FullSemester,
  );
  const { addSectionToSchedule } = useAddSectionToSchedule();

  // handlers
  const onSubmit = (data: SectionInput) => {
    addSectionToSchedule(data);
  };
  const onSemesterLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSemesterLength(e.target.value as SemesterLengthOption);
  };

  // const vars
  const isHalfSemester = semesterLength === SemesterLengthOption.HalfSemester;
  const isIntensiveSemester = semesterLength === SemesterLengthOption.IntensiveSemester;
  const isCustomSemester = semesterLength === SemesterLengthOption.CustomSemester;

  return (
    <FormProvider {...methods}>
      <form className="popover-container" onSubmit={methods.handleSubmit(onSubmit)}>
        <Box mb={SPACING}>
          <Typography className="popover-title" variant="h4">
            Add Section
          </Typography>
        </Box>
        <Grid container spacing={SPACING}>
          {/* TODO: Dropdown for courses already in system */}
          <GridItemTextField label="Prefix" textFieldProps={{ autoFocus: true }} />
          <GridItemTextField label="Number" />
          <GridItemTextField label="Section" />
          <GridItemTextField label="Course Name" />
          <Grid item xs>
            <span>{/* TODO: add error messages? */}</span>
          </Grid>
        </Grid>
        <Grid container spacing={SPACING}>
          {/* TODO: Dropdown for instructors with option to add new one */}
          <GridItemTextField label="Instructor" />
          <GridItemTextField label="Student Hours" />
          <GridItemTextField label="Faculty Hours" />
          {/* TODO: Dropdown for rooms with option to add new one */}
          <GridItemTextField label="Location" />
          <GridItemTextField label="Room Capacity" />
        </Grid>
        <Grid container spacing={SPACING}>
          <GridItemTextField label="Anticipated Size" />
          <GridItemTextField label="Global Max" />
          <GridItemTextField label="Local Max" />
          <GridItemTextField
            label="Start Time"
            textFieldProps={{
              defaultValue: "08:00",
              fullWidth: true,
              type: "time",
            }}
          />
          <GridItemTextField
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
            label="Days"
            options={Object.values(Day).filter((day) => {
              return Object.values(Weekday).includes(day);
            })}
          />
          <GridItemRadioGroup defaultValue={Term.Fall} label="Term" options={Object.values(Term)} />
          <GridItemRadioGroup
            defaultValue={SemesterLengthOption.FullSemester}
            label="Semester Length"
            onChange={onSemesterLengthChange}
            options={Object.values(SemesterLengthOption)}
          />
          <Grid item xs>
            {isHalfSemester && (
              <GridItemRadioGroup
                defaultValue={SemesterLength.HalfFirst}
                label="Half Semester"
                options={Object.values(SemesterLength).filter((h) => {
                  return Object.values(Half).includes(h);
                })}
              />
            )}
            {isIntensiveSemester && (
              <GridItemRadioGroup
                defaultValue={SemesterLength.IntensiveA}
                label="Intensive Semester"
                options={Object.values(SemesterLength).filter((i) => {
                  return Object.values(Intensive).includes(i);
                })}
              />
            )}
            {isCustomSemester && (
              <Grid container direction="column" spacing={SPACING}>
                {/* TODO: add support for custom */}
                <GridItemTextField
                  label="Start Date"
                  textFieldProps={{
                    defaultValue: "2020-20-20",
                    disabled: true,
                    fullWidth: true,
                    // type: "date",
                  }}
                />
                <GridItemTextField
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
            label="Notes"
            textFieldProps={{ multiline: true, name: "comments", rows: 4 }}
          />
        </Grid>
        <Grid alignItems="flex-end" container justify="space-between">
          <Grid item>
            <Typography variant="caption">
              Tip: use <b>tab</b> and <b>shift + tab</b> to navigate, <b>space bar</b> to select
              days, <b>arrow keys</b> to select term and others, and <b>return</b> to submit.
            </Typography>
          </Grid>
          <Grid item>
            <Button color="primary" type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};
