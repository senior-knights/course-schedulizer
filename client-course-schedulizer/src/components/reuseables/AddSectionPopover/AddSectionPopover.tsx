import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, InputAdornment, Typography } from "@material-ui/core";
import {
  GridItemAutocomplete,
  GridItemCheckboxGroup,
  GridItemRadioGroup,
  GridItemTextField,
} from "components";
import { isEqual, isNil, omitBy } from "lodash";
import moment from "moment";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  addFalseToDaysCheckboxList,
  addSectionSchema,
  convertFromSemesterLength,
  emptyMeeting,
  getCourseNames,
  getInstructionalMethods,
  getNumbers,
  getPrefixes,
  getSectionLetters,
  mapInputToInternalTypes,
  mapInternalTypesToInput,
  SectionInput,
  useAddSectionToSchedule,
  useDeleteMeetingFromSchedule,
} from "utilities";
import { AppContext } from "utilities/contexts";
import {
  Day,
  Half,
  Intensive,
  PopoverValueProps,
  SemesterLength,
  SemesterLengthOption,
  Term,
  Weekday,
} from "utilities/interfaces";
import "./AddSectionPopover.scss";

const SPACING = 2;

const transformDataToTrueSectionInput = (data: SectionInput): SectionInput => {
  const dataCourseSection = mapInputToInternalTypes(data);
  let newMeeting = emptyMeeting;
  if (dataCourseSection.newSection.meetings.length) {
    [newMeeting] = dataCourseSection.newSection.meetings;
  }
  return mapInternalTypesToInput({
    course: dataCourseSection.newCourse,
    meeting: newMeeting,
    section: dataCourseSection.newSection,
  });
};

/* A form to input information to add a schedule */
export const AddSectionPopover = ({ values }: PopoverValueProps) => {
  const {
    appState: { schedule, rooms, professors },
    setIsCSVLoading,
  } = useContext(AppContext);

  const methods = useForm<SectionInput>({
    criteriaMode: "all",
    defaultValues: mapInternalTypesToInput(values),
    resolver: yupResolver(addSectionSchema),
  });
  const { reset } = methods;
  const [semesterLength, setSemesterLength] = useState<SemesterLengthOption>(
    convertFromSemesterLength(values?.section.semesterLength),
  );
  const { addSectionToSchedule } = useAddSectionToSchedule();
  const { deleteMeetingFromSchedule } = useDeleteMeetingFromSchedule();

  const onSubmit = (removeOldMeeting: boolean) => {
    return async (data: SectionInput) => {
      const dataTransformed = transformDataToTrueSectionInput(data);
      // Submit the data if any of the form values were updated (omitting null and undefined values)
      if (
        !isEqual(omitBy(dataTransformed, isNil), omitBy(mapInternalTypesToInput(values), isNil))
      ) {
        await addSectionToSchedule(data, values, removeOldMeeting);
      } else {
        // Close the popover
        setIsCSVLoading(true);
        setIsCSVLoading(false);
      }
    };
  };

  const deleteMeeting = () => {
    return () => {
      deleteMeetingFromSchedule(values);
    };
  };

  const onSemesterLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSemesterLength(e.target.value as SemesterLengthOption);
  };

  useEffect(() => {
    setSemesterLength(convertFromSemesterLength(values?.section.semesterLength));
    const inputValues = mapInternalTypesToInput(values);
    reset(inputValues);
  }, [reset, values]);

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
            onClick={methods.handleSubmit(deleteMeeting())}
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
          <GridItemAutocomplete label="Prefix" multiple options={getPrefixes(schedule)} />
          <GridItemAutocomplete label="Number" options={getNumbers(schedule)} />
          <GridItemAutocomplete label="Section" options={getSectionLetters(schedule)} />
          <GridItemAutocomplete label="Name" options={getCourseNames(schedule)} />
          <GridItemAutocomplete
            label="Instructional Method"
            options={getInstructionalMethods(schedule)}
          />
        </Grid>
        <Grid container spacing={SPACING}>
          <GridItemAutocomplete label="Instructor" multiple options={[...professors].sort()} />
          <GridItemAutocomplete label="Location" options={[...rooms].sort()} />
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
            initialValue={addFalseToDaysCheckboxList(values?.meeting?.days) as string[]}
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
            {values?.section.timestamp && (
              <Typography variant="caption">
                Last Edited: {moment(values?.section.timestamp).format("MMMM Do YYYY, h:mm:ss a")}
              </Typography>
            )}
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};

AddSectionPopover.defaultProps = {
  values: undefined,
};
