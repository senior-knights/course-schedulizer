import startCase from "lodash/startCase";
import toLower from "lodash/toLower";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FieldArrayFormProvider } from "utilities";
import { FieldArrayFields } from "./FieldArrayFields";
import { FieldArrayFormActionButtons } from "./FieldArrayFormActionButtons";

export interface FieldArrayFormProps {
  defaultValue: object;
  fieldsName: string;
  onSubmit?: (data: string[]) => void;
}

/**
 * FieldArrayForm creates a form with a variable amount of fields all for similar values.
 * This uses a provider to pass form related data down the component tree.
 * Handles the form submission and formats the name to look nice on the web.
 */
export const FieldArrayForm = ({ fieldsName, defaultValue, onSubmit }: FieldArrayFormProps) => {
  const titleCaseName = startCase(toLower(fieldsName));
  const formMethods = useForm({
    defaultValues: { [titleCaseName]: [defaultValue] },
  });
  const { control, handleSubmit } = formMethods;
  const fieldArrayMethods = useFieldArray({
    control,
    name: titleCaseName,
  });

  return (
    <FieldArrayFormProvider
      {...formMethods}
      {...fieldArrayMethods}
      defaultValue={defaultValue}
      titleCaseName={titleCaseName}
    >
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit && onSubmit(data[titleCaseName] as string[]);
        })}
      >
        <h3>{titleCaseName}: </h3>
        <FieldArrayFields />
        <FieldArrayFormActionButtons />
      </form>
    </FieldArrayFormProvider>
  );
};

FieldArrayForm.defaultProps = {
  onSubmit: undefined,
};
