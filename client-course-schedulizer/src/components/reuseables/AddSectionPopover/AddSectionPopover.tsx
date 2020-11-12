import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Typography } from "@material-ui/core";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { array, object } from "yup";
import {
  Course,
  Day,
  Half,
  Intensive,
  Meeting,
  Section,
  SemesterLength,
  SemesterLengthOption,
  Term,
} from "../../../utilities/interfaces/dataInterfaces";
import { GridItemCheckboxGroup } from "../GridItem/GridItemCheckboxGroup";
import { GridItemRadioGroup } from "../GridItem/GridItemRadioGroup";
import { GridItemTextField } from "../GridItem/GridItemTextField";
import "./AddSectionPopover.scss";

// TODO: make all these dependent types. See comments and days
interface SectionInput {
  anticipatedSize: string;
  comments: Section["comments"];
  days: Meeting["days"];
  duration: string;
  facultyHours: string;
  globalMax: string;
  half: Half;
  instructor: string;
  intensive?: Intensive;
  localMax: string;
  location: string;
  name: string;
  number: string;
  prefix: string;
  section: string;
  semesterLength: SemesterLengthOption;
  startTime: string;
  studentHours: string;
  term: Term;
}

enum Weekday {
  Monday = Day.Monday,
  Tuesday = Day.Tuesday,
  Wednesday = Day.Wednesday,
  Thursday = Day.Thursday,
  Friday = Day.Friday,
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

export const AddSectionPopover = () => {
  const spacing = 4;

  // remove false values from days array
  const schema = object().shape({
    days: array().transform((d) => {
      return d.filter((day: boolean | string) => {
        return day;
      });
    }),
  });

  const { register, handleSubmit, control } = useForm<SectionInput>({
    resolver: yupResolver(schema),
  });
  const [semesterLength, setSemesterLength] = useState("full");

  const onSubmit = (data: SectionInput) => {
    const location = data.location.split(" ");
    const semesterType = convertToSemesterLength(
      data.intensive || data.half || data.semesterLength,
    );
    const newSection: Section = {
      anticipatedSize: Number(data.anticipatedSize),
      comments: data.comments,
      globalMax: Number(data.globalMax),
      instructors: data.instructor.split(/[;,\n]/),
      letter: data.section,
      localMax: Number(data.localMax),
      meetings: [
        {
          days: data.days,
          duration: Number(data.duration),
          location: {
            building: location[0],
            roomNumber: location[1],
          },
          startTime: data.startTime,
        },
      ],
      semesterLength: semesterType,
      term: data.term,
      year: "2021-2022",
    };

    // TODO: Append section to previously existing course if a course has already been created
    const newCourse: Course = {
      facultyHours: Number(data.facultyHours),
      name: data.name,
      number: data.number,
      prefixes: [data.prefix],
      sections: [newSection],
      studentHours: Number(data.studentHours),
    };
    // eslint-disable-next-line no-console
    return console.log(newCourse);
  };
  const onSemesterLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSemesterLength(e.target.value);
  };

  return (
    <form className="popover-container" onSubmit={handleSubmit(onSubmit)}>
      <Typography className="title" variant="h4">
        Add/Update Section
      </Typography>
      <Grid container spacing={spacing}>
        {/* TODO: Allow for multiple prefixes */}
        {/* TODO: Dropdown for courses already in system */}
        <GridItemTextField label="Prefix" register={register} />
        <GridItemTextField label="Number" register={register} />
        <GridItemTextField label="Section" register={register} />
        <GridItemTextField label="Name" register={register} />
      </Grid>
      <Grid container spacing={spacing}>
        {/* TODO: Allow for multiple instructors */}
        {/* TODO: Dropdown for instructors with option to add new one */}
        <GridItemTextField label="Instructor" register={register} />
        {/* TODO: Room capacity? */}
        {/* TODO: Dropdown for rooms with option to add new one */}
        <GridItemTextField label="Location" register={register} />
        {/* TODO: Allow facultyHours and studentHours to be set separately for a section */}
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
      <Grid container spacing={spacing}>
        <GridItemTextField
          label="Anticipated Size"
          register={register}
          textFieldProps={{ multiline: true, name: "anticipatedSize", rows: 2 }}
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
      <Grid container spacing={spacing}>
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
          <Button color="primary" type="submit" variant="contained">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
