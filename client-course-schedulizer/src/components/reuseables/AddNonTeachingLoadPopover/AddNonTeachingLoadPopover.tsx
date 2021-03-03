import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import { GridItemCheckboxGroup, GridItemTextField } from "components";
import { isEqual } from "lodash";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  addNonTeachingLoadSchema,
  CourseSectionMeeting,
  mapNonTeachingLoadValuesToInput,
  NonTeachingLoadInput,
  removeUncheckedValues,
  Term,
  useAddSectionToSchedule,
} from "utilities";

const SPACING = 2;

interface AddNonTeachingLoadPopover {
  values?: CourseSectionMeeting;
}

export const AddNonTeachingLoadPopover = ({ values }: AddNonTeachingLoadPopover) => {
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

  const { reset, getValues } = methods;

  useEffect(() => {
    const inputValues = mapNonTeachingLoadValuesToInput(values);
    const formValues = getValues();
    inputValues.terms = removeUncheckedValues(inputValues.terms as string[]) as Term[];

    // Update the form values if they have changed
    if (!isEqual(inputValues, formValues)) {
      reset(inputValues);
    }
  }, [reset, getValues, values]);

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
          <GridItemCheckboxGroup
            initialValue={values?.section.term as string[]}
            label="Terms"
            options={Object.values(Term)}
          />
        </Grid>
        <Button color="primary" onClick={methods.handleSubmit(onSubmit())} variant="contained">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};

AddNonTeachingLoadPopover.defaultProps = {
  values: undefined,
};
