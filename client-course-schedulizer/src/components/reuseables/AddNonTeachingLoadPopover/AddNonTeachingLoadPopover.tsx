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
  useDeleteSectionFromSchedule,
} from "utilities";
import "./AddNonTeachingLoadPopover.scss";

const SPACING = 2;

interface AddNonTeachingLoadPopover {
  values?: CourseSectionMeeting;
}

export const AddNonTeachingLoadPopover = ({ values }: AddNonTeachingLoadPopover) => {
  const { addNonTeachingLoadToSchedule } = useAddSectionToSchedule();

  const onSubmit = (removeOldActivity: boolean) => {
    return (data: NonTeachingLoadInput) => {
      addNonTeachingLoadToSchedule(data, values, removeOldActivity);
    };
  };

  const methods = useForm<NonTeachingLoadInput>({
    criteriaMode: "all",
    resolver: yupResolver(addNonTeachingLoadSchema),
  });

  const { deleteSectionFromSchedule } = useDeleteSectionFromSchedule();

  const deleteSection = () => {
    return () => {
      deleteSectionFromSchedule(values);
    };
  };

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
            {values ? "Update Non-Teaching Activity" : "Add Non-Teaching Activity"}
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
        <Grid className="popover-buttons" item>
          <Button
            color="primary"
            onClick={methods.handleSubmit(onSubmit(values !== undefined))}
            variant="contained"
          >
            {values ? "Update Activity" : "Add Activity"}
          </Button>
          {values && (
            <Button
              color="secondary"
              onClick={methods.handleSubmit(deleteSection())}
              variant="contained"
            >
              Delete Activity
            </Button>
          )}
        </Grid>
      </form>
    </FormProvider>
  );
};

AddNonTeachingLoadPopover.defaultProps = {
  values: undefined,
};
