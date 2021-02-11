import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, InputAdornment, Typography } from "@material-ui/core";
import { GridItemCheckboxGroup, GridItemRadioGroup, GridItemTextField } from "components";
import moment from "moment";
import React, { ChangeEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  addSectionSchema,
  convertFromSemesterLength,
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
    resolver: yupResolver(addSectionSchema),
  });
  const [semesterLength, setSemesterLength] = useState<SemesterLengthOption>(
    convertFromSemesterLength(values?.section.semesterLength).toLowerCase() as SemesterLengthOption,
  );
  const { addSectionToSchedule } = useAddSectionToSchedule();
  const { deleteSectionFromSchedule } = useDeleteSectionFromSchedule();

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

  const locationValue = (
    (values && `${values?.meeting.location.building} ${values?.meeting.location.roomNumber}`) ||
    ""
  ).trim();

  const buttons = () => {
    const addTitle = values ? "Add New Section" : "Add Section";
    return (
      <>
        {values && (
          <Button
            className="update-button"
            color="primary"
            onClick={methods.handleSubmit(onSubmit(true))}
            variant="contained"
          >
            Update Section
          </Button>
        )}
        <Button
          className="add-button"
          color="primary"
          onClick={methods.handleSubmit(onSubmit(false))}
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
          <GridItemTextField
            label="Department"
            textFieldProps={{ autoFocus: true }}
            value={values?.course.department}
          />
        </Grid>
        <Grid container spacing={SPACING}>
          {/* TODO: Dropdown for courses already in system */}
          <GridItemTextField label="Prefix" value={values?.course.prefixes.join()} />
          <GridItemTextField label="Number" value={values?.course.number} />
          <GridItemTextField label="Section" value={values?.section.letter} />
          <GridItemTextField label="Name" value={values?.course.name} />
          <GridItemTextField
            label="Instructional Method"
            value={values?.section.instructionalMethod ?? "LEC"}
          />
        </Grid>
        <Grid container spacing={SPACING}>
          {/* TODO: Dropdown for instructors with option to add new one */}
          <GridItemTextField label="Instructor" value={values?.section.instructors.join()} />
          {/* TODO: Dropdown for rooms with option to add new one */}
          <GridItemTextField label="Location" value={locationValue} />
          <GridItemTextField
            label="Room Capacity"
            value={(values?.meeting.location.roomCapacity || "").toString()}
          />
          <GridItemTextField
            label="Faculty Hours"
            value={(values?.section.facultyHours || values?.course.facultyHours || "").toString()}
          />
          <GridItemTextField
            label="Student Hours"
            value={(values?.section.studentHours || values?.course.studentHours || "").toString()}
          />
        </Grid>
        <Grid container spacing={SPACING}>
          <GridItemTextField
            label="Anticipated Size"
            value={(values?.section.anticipatedSize || "").toString()}
          />
          <GridItemTextField label="Used" value={(values?.section.used || "").toString()} />
          <GridItemTextField
            label="Day 10 Used"
            value={(values?.section.day10Used || "").toString()}
          />
          <GridItemTextField
            label="Local Max"
            value={(values?.section.localMax || "").toString()}
          />
          <GridItemTextField
            label="Global Max"
            value={(values?.section.globalMax || "").toString()}
          />
        </Grid>
        <Grid container spacing={SPACING}>
          <GridItemTextField
            label="Start Time"
            textFieldProps={{ fullWidth: true, type: "time" }}
            value={
              values?.meeting.startTime
                ? moment(values?.meeting.startTime, "h:mm A").format("HH:mm")
                : "08:00"
            }
          />
          <GridItemTextField
            label="Duration"
            textFieldProps={{
              InputProps: {
                endAdornment: <InputAdornment position="end">min</InputAdornment>,
              },
            }}
            value={(values?.meeting.duration || "").toString()}
          />
          <GridItemTextField label="Year" value={(values?.section.year || "").toString()} />
          <GridItemTextField label="Status" value={values?.section.status ?? "Active"} />
          {/* This empty item just fills space */}
          <Grid item xs />
        </Grid>
        <Grid container spacing={SPACING}>
          <GridItemCheckboxGroup
            label="Days"
            options={Object.values(Day).filter((day) => {
              return Object.values(Weekday).includes(day);
            })}
            value={values?.meeting.days}
          />
          <GridItemRadioGroup
            defaultValue={values?.section.term || Term.Fall}
            label="Term"
            options={Object.values(Term)}
          />
          <GridItemRadioGroup
            defaultValue={convertFromSemesterLength(values?.section.semesterLength)}
            label="Semester Length"
            onChange={onSemesterLengthChange}
            options={Object.values(SemesterLengthOption)}
          />
          <Grid item xs>
            {isHalfSemester && (
              <GridItemRadioGroup
                defaultValue={values?.section.semesterLength || SemesterLength.HalfFirst}
                label="Half Semester"
                options={Object.values(SemesterLength).filter((h) => {
                  return Object.values(Half).includes(h);
                })}
              />
            )}
            {isIntensiveSemester && (
              <GridItemRadioGroup
                defaultValue={values?.section.semesterLength || SemesterLength.IntensiveA}
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
