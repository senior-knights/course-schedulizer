import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Typography } from "@material-ui/core";
import { GridItemCheckboxGroup, GridItemRadioGroup, GridItemTextField } from "components";
import React, { ChangeEvent, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AppContext } from "utilities/contexts";
import {
  insertSectionCourse,
  instructorCase,
  locationCase,
  prefixCase,
  startTimeCase,
} from "utilities/helpers";
import {
  Course,
  Day,
  Half,
  Instructor,
  Intensive,
  Location,
  Meeting,
  Prefix,
  Section,
  SemesterLength,
  SemesterLengthOption,
  Term,
  Weekday,
} from "utilities/interfaces";
import { array, object } from "yup";
import "./AddSectionPopover.scss";

interface SectionInput {
  anticipatedSize: Section["anticipatedSize"];
  comments: Section["comments"];
  days: Meeting["days"];
  duration: Meeting["duration"];
  facultyHours: Section["facultyHours"];
  globalMax: Section["globalMax"];
  half: Half;
  instructor: Instructor;
  intensive?: Intensive;
  localMax: Section["localMax"];
  location: string;
  name: Course["name"];
  number: Course["number"];
  prefix: Prefix;
  roomCapacity: Location["roomCapacity"];
  section: Section["letter"];
  semesterLength: SemesterLengthOption;
  startTime: Meeting["startTime"];
  studentHours: Section["studentHours"];
  term: Section["term"];
}

const convertToSemesterLength = (sl: Half | Intensive | SemesterLengthOption): SemesterLength => {
  switch (sl) {
    case Half.First:
      return SemesterLength.HalfFirst;
    case Half.Second:
      return SemesterLength.HalfSecond;
    case Intensive.A:
      return SemesterLength.IntensiveA;
    case Intensive.B:
      return SemesterLength.IntensiveB;
    case Intensive.C:
      return SemesterLength.IntensiveC;
    case Intensive.D:
      return SemesterLength.IntensiveD;
    default:
      return SemesterLength.Full;
  }
};

const SPACING = 4;

// Remove false values from days array
const schema = object().shape({
  days: array().transform((d) => {
    return d.filter((day: boolean | string) => {
      return day;
    });
  }),
});

export const AddSectionPopover = () => {
  const {
    appState: { schedule },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);
  const { register, handleSubmit, control } = useForm<SectionInput>({
    resolver: yupResolver(schema),
  });
  const [semesterLength, setSemesterLength] = useState("full");

  const onSubmit = (data: SectionInput) => {
    setIsCSVLoading(true);
    const location = locationCase(data.location);
    const semesterType = convertToSemesterLength(
      data.intensive || data.half || data.semesterLength,
    );
    const newSection: Section = {
      anticipatedSize: Number(data.anticipatedSize),
      comments: data.comments,
      facultyHours: Number(data.facultyHours),
      globalMax: Number(data.globalMax),
      instructors: instructorCase(data.instructor),
      letter: data.section,
      localMax: Number(data.localMax),
      meetings: [
        {
          days: data.days,
          duration: Number(data.duration),
          location: {
            building: location[0],
            roomCapacity: Number(data.roomCapacity),
            roomNumber: location[1],
          },
          startTime: startTimeCase(data.startTime),
        },
      ],
      semesterLength: semesterType,
      studentHours: Number(data.studentHours),
      term: data.term,
      year: "2021-2022",
    };

    const newCourse: Course = {
      facultyHours: Number(data.facultyHours),
      name: data.name,
      number: data.number,
      prefixes: prefixCase(data.prefix),
      // The newSection will be added later in insertSectionCourse()
      sections: [],
      studentHours: Number(data.studentHours),
    };

    // Insert the Section to the Schedule, either as a new Course or to an existing Course
    insertSectionCourse(schedule, newSection, newCourse);

    appDispatch({ payload: { schedule }, type: "setScheduleData" });
    setIsCSVLoading(false);
  };
  const onSemesterLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSemesterLength(e.target.value);
  };

  return (
    <form className="popover-container">
      <Typography className="title" variant="h4">
        Add/Update Section
      </Typography>
      <Grid container spacing={SPACING}>
        {/* TODO: Dropdown for courses already in system */}
        <GridItemTextField label="Prefix" register={register} />
        <GridItemTextField label="Number" register={register} />
        <GridItemTextField label="Section" register={register} />
        <GridItemTextField label="Name" register={register} />
      </Grid>
      <Grid container spacing={SPACING}>
        {/* TODO: Dropdown for instructors with option to add new one */}
        <GridItemTextField label="Instructor" register={register} />
        {/* TODO: Dropdown for rooms with option to add new one */}
        <GridItemTextField label="Location" register={register} />
        <GridItemTextField
          label="Room Capacity"
          register={register}
          textFieldProps={{ name: "roomCapacity" }}
        />
        <GridItemTextField
          label="Faculty Hours"
          register={register}
          textFieldProps={{ name: "facultyHours" }}
        />
        <GridItemTextField
          label="Student Hours"
          register={register}
          textFieldProps={{ name: "studentHours" }}
        />
      </Grid>
      <Grid container spacing={SPACING}>
        <GridItemTextField
          label="Anticipated Size"
          register={register}
          textFieldProps={{ name: "anticipatedSize" }}
        />
        <GridItemTextField
          label="Global Max"
          register={register}
          textFieldProps={{ name: "globalMax" }}
        />
        <GridItemTextField
          label="Local Max"
          register={register}
          textFieldProps={{ name: "localMax" }}
        />
        <GridItemTextField label="Duration" register={register} />
        <GridItemTextField
          label="Start Time"
          register={register}
          textFieldProps={{ defaultValue: "08:00", name: "startTime", type: "time" }}
        />
      </Grid>
      <Grid container spacing={SPACING}>
        <GridItemCheckboxGroup
          label="Days"
          options={Object.values(Day).filter((day) => {
            return Object.values(Weekday).includes(day);
          })}
          register={register}
        />
        <GridItemRadioGroup
          control={control}
          defaultValue="FA"
          label="Term"
          options={Object.values(Term)}
          register={register}
        />
        <GridItemRadioGroup
          control={control}
          defaultValue="full"
          label="Semester Length"
          lowercase
          name="semesterLength"
          onChange={onSemesterLengthChange}
          options={Object.values(SemesterLengthOption)}
          register={register}
        />
        {semesterLength === "half" && (
          <GridItemRadioGroup
            control={control}
            defaultValue="First"
            label="Half Semester"
            lowercase
            name="half"
            options={Object.values(SemesterLength).filter((h) => {
              return Object.values(Half).includes(h);
            })}
            register={register}
          />
        )}
        {semesterLength === "intensive" && (
          <GridItemRadioGroup
            control={control}
            defaultValue="A"
            label="Intensive Semester"
            name="intensive"
            options={Object.values(SemesterLength).filter((i) => {
              return Object.values(Intensive).includes(i);
            })}
            register={register}
          />
        )}
        <GridItemTextField
          label="Notes"
          register={register}
          textFieldProps={{ multiline: true, name: "comments", rows: 4 }}
        />
      </Grid>
      <Grid container>
        <Grid item xs>
          <Button color="primary" onClick={handleSubmit(onSubmit)} variant="contained">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
