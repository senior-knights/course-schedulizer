import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Typography } from "@material-ui/core";
import { GridItemCheckboxGroup, GridItemRadioGroup, GridItemTextField } from "components";
import { indexOf } from "lodash";
import moment from "moment";
import React, { ChangeEvent, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import {
  convertFromSemesterLength,
  convertToSemesterLength,
  emptyCourse,
  emptyMeeting,
  emptySection,
  getCourse,
  getSection,
  removeSection,
} from "utilities";
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
  CourseSectionMeeting,
  Day,
  Half,
  Intensive,
  Location,
  Meeting,
  Section,
  SemesterLength,
  SemesterLengthOption,
  Term,
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
  instructor: string;
  intensive?: Intensive;
  localMax: Section["localMax"];
  location: string;
  name: Course["name"];
  number: Course["number"];
  prefix: string;
  roomCapacity: Location["roomCapacity"];
  section: Section["letter"];
  semesterLength: SemesterLengthOption;
  startTime: Meeting["startTime"];
  studentHours: Section["studentHours"];
  term: Section["term"];
}

enum Weekday {
  Monday = Day.Monday,
  Tuesday = Day.Tuesday,
  Wednesday = Day.Wednesday,
  Thursday = Day.Thursday,
  Friday = Day.Friday,
}

interface AddSectionPopover {
  values?: CourseSectionMeeting;
}

export const AddSectionPopover = ({ values }: AddSectionPopover) => {
  const {
    appState: { schedule },
    appDispatch,
    setIsCSVLoading,
  } = useContext(AppContext);

  const spacing = 4;

  // Remove false values from days array
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
  const [semesterLength, setSemesterLength] = useState(
    convertFromSemesterLength(values?.section.semesterLength).toLowerCase(),
  );

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

    // Remove the old version of the section if there is one
    const oldSection = getSection(
      schedule,
      newCourse.prefixes,
      newCourse.number,
      newSection.letter,
      newSection.term,
    );
    if (oldSection) {
      const oldCourse = getCourse(schedule, newCourse.prefixes, newCourse.number);
      const courseIndex = indexOf(schedule.courses, oldCourse);
      removeSection(schedule, newSection.letter, newSection.term, courseIndex);
    }

    // Insert the Section to the Schedule, either as a new Course or to an existing Course
    insertSectionCourse(schedule, newSection, newCourse);

    appDispatch({ payload: { schedule }, type: "setScheduleData" });
    setIsCSVLoading(false);
  };
  const onSemesterLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSemesterLength(e.target.value);
  };

  return (
    <form className="popover-container" onSubmit={handleSubmit(onSubmit)}>
      <Typography className="add-section-title" variant="h4">
        Add/Update Section
      </Typography>
      <Grid container spacing={spacing}>
        {/* TODO: Dropdown for courses already in system */}
        <GridItemTextField
          label="Prefix"
          register={register}
          value={values?.course.prefixes.join()}
        />
        <GridItemTextField label="Number" register={register} value={values?.course.number} />
        <GridItemTextField label="Section" register={register} value={values?.section.letter} />
        <GridItemTextField label="Name" register={register} value={values?.course.name} />
      </Grid>
      <Grid container spacing={spacing}>
        {/* TODO: Dropdown for instructors with option to add new one */}
        <GridItemTextField
          label="Instructor"
          register={register}
          value={values?.section.instructors.join()}
        />
        {/* TODO: Dropdown for rooms with option to add new one */}
        <GridItemTextField
          label="Location"
          register={register}
          value={`${values?.meeting.location.building} ${values?.meeting.location.roomNumber}`.trim()}
        />
        <GridItemTextField
          label="Room Capacity"
          register={register}
          textFieldProps={{ name: "roomCapacity" }}
          value={(values?.meeting.location.roomCapacity || "").toString()}
        />
        <GridItemTextField
          label="Faculty Hours"
          register={register}
          textFieldProps={{ name: "facultyHours" }}
          value={(values?.section.facultyHours || values?.course.facultyHours || "").toString()}
        />
        <GridItemTextField
          label="Student Hours"
          register={register}
          textFieldProps={{ name: "studentHours" }}
          value={(values?.section.studentHours || values?.course.studentHours || "").toString()}
        />
      </Grid>
      <Grid container spacing={spacing}>
        <GridItemTextField
          label="Anticipated Size"
          register={register}
          textFieldProps={{ name: "anticipatedSize" }}
          value={(values?.section.anticipatedSize || "").toString()}
        />
        <GridItemTextField
          label="Local Max"
          register={register}
          textFieldProps={{ name: "localMax" }}
          value={(values?.section.localMax || "").toString()}
        />
        <GridItemTextField
          label="Global Max"
          register={register}
          textFieldProps={{ name: "globalMax" }}
          value={(values?.section.globalMax || "").toString()}
        />
        <GridItemTextField
          label="Start Time"
          register={register}
          textFieldProps={{ name: "startTime", type: "time" }}
          value={
            values?.meeting.startTime
              ? moment(values?.meeting.startTime, "h:mma").format("HH:mm")
              : "08:00"
          }
        />
        <GridItemTextField
          label="Duration"
          register={register}
          value={(values?.meeting.duration || "").toString()}
        />
      </Grid>
      <Grid container spacing={spacing}>
        <GridItemCheckboxGroup
          label="Days"
          options={Object.values(Day).filter((day) => {
            return Object.values(Weekday).includes(day);
          })}
          register={register}
          value={values?.meeting.days}
        />
        <GridItemRadioGroup
          control={control}
          defaultValue={values?.section.term || "FA"}
          label="Term"
          options={Object.values(Term)}
          register={register}
        />
        <GridItemRadioGroup
          control={control}
          defaultValue={convertFromSemesterLength(values?.section.semesterLength).toLowerCase()}
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
            defaultValue={values?.section.semesterLength || "First"}
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
            defaultValue={values?.section.semesterLength || "A"}
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
          value={values?.section.comments}
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

AddSectionPopover.defaultProps = {
  values: {
    course: emptyCourse,
    meeting: emptyMeeting,
    section: emptySection,
  },
};
