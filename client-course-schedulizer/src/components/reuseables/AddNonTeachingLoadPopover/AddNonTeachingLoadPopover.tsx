import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Typography } from "@material-ui/core";
import { GridItemTextField } from "components";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { addNonTeachingLoadSchema, NonTeachingLoadInput, useAddSectionToSchedule } from "utilities";

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
            Add Non-Teaching Load
          </Typography>
        </Box>
        <GridItemTextField label="Name" />
        <GridItemTextField label="Instructor" />
        <GridItemTextField label="Faculty Hours" />
        <Button color="primary" onClick={methods.handleSubmit(onSubmit())} variant="contained">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};
