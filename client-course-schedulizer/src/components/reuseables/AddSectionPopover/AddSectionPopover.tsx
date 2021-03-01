import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, InputAdornment, Typography } from "@material-ui/core";
import { GridItemCheckboxGroup, GridItemRadioGroup, GridItemTextField } from "components";
import React, { ChangeEvent, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  addSectionSchema,
  convertFromSemesterLength,
  mapInternalTypesToInput,
  SectionInput,
  useAddSectionToSchedule,
  useDeleteSectionFromSchedule,
} from "utilities";
import {
  CourseSectionMeeting,
  Day,
  Half,
  Intensive,
  SemesterLength,
  SemesterLengthOption,
  Term,
  Weekday,
} from "utilities/interfaces";
import "./AddSectionPopover.scss";

interface AddSectionPopover {
  values?: CourseSectionMeeting;
}
const SPACING = 2;

/* A form to input information to add a schedule */
export const AddSectionPopover = ({ values }: AddSectionPopover) => {
  const methods = useForm<SectionInput>({
    criteriaMode: "all",
    defaultValues: mapInternalTypesToInput(values),
    resolver: yupResolver(addSectionSchema),
  });
  const [semesterLength, setSemesterLength] = useState<SemesterLengthOption>(
    convertFromSemesterLength(values?.section.semesterLength),
  );
  const { addSectionToSchedule } = useAddSectionToSchedule();
  const { deleteSectionFromSchedule } = useDeleteSectionFromSchedule();

  const { reset } = methods;

  useEffect(() => {
    reset(mapInternalTypesToInput(values));
  }, [reset, values]);

  const onSubmit = (removeOldSection: boolean) => {
    return (data: SectionInput) => {
      addSectionToSchedule(data, values, removeOldSection);
    };
  };

  const deleteSection = () => {
    return () => {
      deleteSectionFromSchedule(values);
    };
  };

  const onSemesterLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSemesterLength(e.target.value as SemesterLengthOption);
  };

  const isHalfSemester = semesterLength === SemesterLengthOption.HalfSemester;
  const isIntensiveSemester = semesterLength === SemesterLengthOption.IntensiveSemester;
  const isCustomSemester = semesterLength === SemesterLengthOption.CustomSemester;
  const title = values ? "Update Section" : "Add Section";

  let defaultTerm = values?.section.term;
  if (Array.isArray(defaultTerm)) {
    [defaultTerm] = defaultTerm;
  }

  const buttons = () => {
    const addTitle = values ? "Add New Section" : "Add Section";
    return (
      <>
        {values && (
          <Button
            className="update-button"
            color="primary"
            onClick={methods.handleSubmit(onSubmit(true))}
            type="submit"
            variant="contained"
          >
            Update Section
          </Button>
        )}
        <Button
          className="add-button"
          color="primary"
          onClick={methods.handleSubmit(onSubmit(false))}
          type="submit"
          variant="contained"
        >
          {addTitle}
        </Button>
        {values && (
          <Button
            className="delete-button"
            color="secondary"
            onClick={methods.handleSubmit(deleteSection())}
            variant="contained"
          >
            Delete Section
          </Button>
        )}
      </>
    );
  };

  // TODO: Make fields for termStart, startDate, and endDate?
  return (
    <FormProvider {...methods}>
      <form className="popover-container">
        <Box mb={SPACING}>
          <Typography className="popover-title" variant="h4">
            {title}
          </Typography>
        </Box>
        <Grid container spacing={SPACING}>
          <GridItemTextField label="Department" textFieldProps={{ autoFocus: true }} />
        </Grid>
        <Grid container spacing={SPACING}>
          {/* TODO: Dropdown for courses already in system */}
          <GridItemTextField label="Prefix" />
          <GridItemTextField label="Number" />
          <GridItemTextField label="Section" />
          <GridItemTextField label="Name" />
          <GridItemTextField label="Instructional Method" />
        </Grid>
        <Grid container spacing={SPACING}>
          {/* TODO: Dropdown for instructors with option to add new one */}
          <GridItemTextField label="Instructor" />
          {/* TODO: Dropdown for rooms with option to add new one */}
          <GridItemTextField label="Location" />
          <GridItemTextField label="Room Capacity" />
          <GridItemTextField label="Faculty Hours" />
          <GridItemTextField label="Student Hours" />
        </Grid>
        <Grid container spacing={SPACING}>
          <GridItemTextField label="Anticipated Size" />
          <GridItemTextField label="Used" />
          <GridItemTextField label="Day 10 Used" />
          <GridItemTextField label="Local Max" />
          <GridItemTextField label="Global Max" />
        </Grid>
        <Grid container spacing={SPACING}>
          <GridItemTextField
            label="Start Time"
            textFieldProps={{ fullWidth: true, type: "time" }}
          />
          <GridItemTextField
            label="Duration"
            textFieldProps={{
              InputProps: {
                endAdornment: <InputAdornment position="end">min</InputAdornment>,
              },
            }}
          />
          <GridItemTextField label="Year" />
          <GridItemTextField label="Status" />
          {/* This empty item just fills space */}
          <Grid item xs />
        </Grid>
        <Grid container spacing={SPACING}>
          <GridItemCheckboxGroup
            initialValue={values?.meeting?.days}
            label="Days"
            options={Object.values(Day).filter((day) => {
              return Object.values(Weekday).includes(day);
            })}
          />
          <GridItemRadioGroup label="Term" options={Object.values(Term)} />
          <GridItemRadioGroup
            label="Semester Length"
            onChange={onSemesterLengthChange}
            options={Object.values(SemesterLengthOption)}
          />
          <Grid item xs>
            {isHalfSemester && (
              <GridItemRadioGroup
                label="Half Semester"
                options={Object.values(SemesterLength).filter((h) => {
                  return Object.values(Half).includes(h);
                })}
              />
            )}
            {isIntensiveSemester && (
              <GridItemRadioGroup
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
                <Typography variant="caption">
                  Custom semester lengths are not support yet.
                </Typography>
              </Grid>
            )}
          </Grid>
          <GridItemTextField
            label="Notes"
            textFieldProps={{ multiline: true, name: "comments", rows: 4 }}
            value={values?.section.comments}
          />
        </Grid>
        <Grid alignItems="flex-end" container justify="space-between">
          <Grid item>
            <Typography variant="caption">
              Tip: use <b>tab</b> and <b>shift + tab</b> to navigate, <b>space bar</b> to select
              days, <b>arrow keys</b> to select term and others, and <b>return</b> to submit.
            </Typography>
          </Grid>
          <Grid className="popover-buttons" item>
            {buttons()}
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};

AddSectionPopover.defaultProps = {
  values: undefined,
};
