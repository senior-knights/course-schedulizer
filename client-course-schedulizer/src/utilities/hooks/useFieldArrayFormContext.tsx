import React from "react";
import { FieldValues } from "react-hook-form";
import { AllFormMethods, FieldArrayFormProviderProps } from "utilities";

/** Creates a Context for a FieldArrayForm Instance */
const FieldArrayFormContext = React.createContext<AllFormMethods | null>(null);
FieldArrayFormContext.displayName = "RHFArrayContext";

/**
 * Allows a component inside the FieldArrayFormContext access to all of the
 *   methods and other data in the FieldArrayForm
 * @returns AllFormMethods
 */
export const useFieldArrayFormContext = <TFieldValues extends FieldValues>(): AllFormMethods<
  TFieldValues
> => {
  return React.useContext(FieldArrayFormContext) as AllFormMethods<TFieldValues>;
};

/**
 * A provider that has AllFormMethods within it. Used with FieldArrayForms
 */
export const FieldArrayFormProvider = <TFieldValues extends FieldValues>({
  children,
  ...props
}: FieldArrayFormProviderProps<TFieldValues>) => {
  return (
    <FieldArrayFormContext.Provider value={{ ...props } as AllFormMethods}>
      {children}
    </FieldArrayFormContext.Provider>
  );
};
