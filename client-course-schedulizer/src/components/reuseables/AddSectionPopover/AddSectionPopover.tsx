import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Typography } from "@material-ui/core";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { GridItemCheckboxGroup } from "../GridItem/GridItemCheckboxGroup";
import { GridItemRadioGroup } from "../GridItem/GridItemRadioGroup";
import { GridItemTextField } from "../GridItem/GridItemTextField";
import "./AddSectionPopover.scss";

export const AddSectionPopover = () => {
  const days = ["M", "T", "W", "Th", "F"];
  const terms = ["FA", "SP", "SU"];
  const semesterLengths = ["Full", "Half", "Intensive"];
  const halfSemester = ["First", "Second"];
  const intensiveSemester = ["A", "B", "C", "D"];
  const spacing = 4;

  const schema = Yup.object().shape({
    days: Yup.array().transform((d) => {
      return d.filter((day: boolean | string) => {
        return day;
      });
    }),
  });

  const { register, handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
  });
  const [semesterLength, setSemesterLength] = useState("full");

  const onSubmit = (data: unknown) => {
    return console.log(data);
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
        <GridItemTextField label="Prefix" register={register} />
        <GridItemTextField label="Number" register={register} />
        <GridItemTextField label="Section" register={register} />
        <GridItemTextField label="Name" register={register} />
      </Grid>
      <Grid container spacing={spacing}>
        <GridItemTextField label="Instructor" register={register} />
        <GridItemTextField label="Location" register={register} />
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
        <GridItemCheckboxGroup label="Days" options={days} register={register} />
        <GridItemRadioGroup
          control={control}
          defaultValue="FA"
          label="Term"
          options={terms}
          register={register}
        />
        <GridItemRadioGroup
          control={control}
          defaultValue="full"
          label="Semester Length"
          lowercase
          name="semesterLength"
          onChange={onSemesterLengthChange}
          options={semesterLengths}
          register={register}
        />
        {semesterLength === "half" && (
          <GridItemRadioGroup
            control={control}
            defaultValue="First"
            label="Half Semester"
            lowercase
            name="half"
            options={halfSemester}
            register={register}
          />
        )}
        {semesterLength === "intensive" && (
          <GridItemRadioGroup
            control={control}
            defaultValue="A"
            label="Intensive Semester"
            name="intensive"
            options={intensiveSemester}
            register={register}
          />
        )}
        <GridItemTextField
          label="Notes"
          register={register}
          textFieldProps={{ multiline: true, rows: 4 }}
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
