import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import { GridItemCheckboxGroup, GridItemTextField } from "components";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  addNonTeachingLoadSchema,
  NonTeachingLoadInput,
  Term,
  useAddSectionToSchedule,
} from "utilities";

const SPACING = 2;

export const AddNonTeachingLoadPopover = () => {
  const { addNonTeachingLoadToSchedule } = useAddSectionToSchedule();

  const onSubmit = () => {
    return (data: NonTeachingLoadInput) => {
      addNonTeachingLoadToSchedule(data);
    };
  };

  const methods = useForm<NonTeachingLoadInput>({
    criteriaMode: "all",
    resolver: yupResolver(addNonTeachingLoadSchema),
  });
  return (
    <FormProvider {...methods}>
      <form className="popover-container">
        <Box>
          <Typography className="popover-title" variant="h4">
            Add Non-Teaching Activity
          </Typography>
        </Box>
        <Grid container spacing={SPACING}>
          <GridItemTextField label="Activity" />
        </Grid>
        <Grid container spacing={SPACING}>
          <GridItemTextField label="Instructor" />
        </Grid>
        <Grid container spacing={SPACING}>
          <GridItemTextField label="Faculty Hours" />
        </Grid>
        <Grid container spacing={SPACING}>
          <GridItemCheckboxGroup label="Terms" options={Object.values(Term)} />
        </Grid>
        <Button color="primary" onClick={methods.handleSubmit(onSubmit())} variant="contained">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};
