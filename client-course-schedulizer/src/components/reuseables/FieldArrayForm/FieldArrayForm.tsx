import { Card, CardContent, TextFieldProps } from "@material-ui/core";
import startCase from "lodash/startCase";
import toLower from "lodash/toLower";
import React, { useCallback, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FieldArrayFormProvider } from "utilities";
import {
  HarmonyStepperCallbackState,
  useHarmonyStepperCallback,
} from "utilities/hooks/useHarmonyStepperCallback";
import { FieldArrayFields } from "./FieldArrayFields";
import { FieldArrayFormActionButtons } from "./FieldArrayFormActionButtons";

export interface FieldArrayFormProps {
  defaultValues?: object[];
  emptyValue: object;
  fieldsName: string;
  onSubmit?: (data: object[]) => void;
  textFieldProps?: TextFieldProps;
}

/**
 * FieldArrayForm creates a form with a variable amount of fields all for similar values.
 * This uses a provider to pass form related data down the component tree.
 * Handles the form submission and formats the name to look nice on the web.
 */
export const FieldArrayForm = ({
  fieldsName,
  emptyValue,
  defaultValues = [],
  onSubmit,
  textFieldProps,
}: FieldArrayFormProps) => {
  const titleCaseName = startCase(toLower(fieldsName));

  // TODO: remove this. This component could not contain Harmony code.
  const pushCallbacks = useHarmonyStepperCallback(selector);
  const formMethods = useForm({
    defaultValues: {
      [titleCaseName]: [...defaultValues, emptyValue],
    },
  });
  const { control, handleSubmit } = formMethods;
  const fieldArrayMethods = useFieldArray({
    control,
    name: titleCaseName,
  });

  const onFormSubmit = useCallback(
    // kinda a hack to get this to work and not do a full page submit. Ideally this would be in another callback onSave
    handleSubmit((formData) => {
      const dataWithNoEmpty = (formData as { [key: string]: object[] })[titleCaseName].filter(
        (obj) => {
          return Object.entries(obj).every(([, value]) => {
            return value !== "";
          });
        },
      );
      onSubmit && onSubmit(dataWithNoEmpty);
    }),
    [handleSubmit, onSubmit, titleCaseName],
  );

  useEffect(() => {
    pushCallbacks(onFormSubmit);
  }, [onFormSubmit, pushCallbacks]);

  return (
    <FieldArrayFormProvider
      {...formMethods}
      {...fieldArrayMethods}
      defaultValue={emptyValue}
      defaultValues={defaultValues}
      textFieldProps={textFieldProps}
      titleCaseName={titleCaseName}
    >
      <Card style={{ marginBottom: "2em" }} variant="outlined">
        <CardContent>
          <form onSubmit={onFormSubmit}>
            <h2>{titleCaseName}: </h2>
            <FieldArrayFields />
            <FieldArrayFormActionButtons />
          </form>
        </CardContent>
      </Card>
    </FieldArrayFormProvider>
  );
};

FieldArrayForm.defaultProps = {
  onSubmit: undefined,
};

const selector = (state: HarmonyStepperCallbackState) => {
  return state.pushCallbacks;
};
