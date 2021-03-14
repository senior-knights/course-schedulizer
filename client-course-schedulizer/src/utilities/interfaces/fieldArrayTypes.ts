import { FieldValues, UseFieldArrayMethods, UseFormMethods } from "react-hook-form";

/**
 * Some additional helpful data when dealing with FieldArrayForms
 */
interface FieldArrayHelpers {
  defaultValue: Partial<FieldValues>;
  titleCaseName: string;
}

/**
 * Combines the base UseFormMethods with UseFormArrayMethods and additional FieldArrayHelpers
 */
export type AllFormMethods<TFieldValues extends FieldValues = FieldValues> = UseFormMethods<
  TFieldValues
> &
  UseFieldArrayMethods &
  Partial<FieldArrayHelpers>;

/**
 * Creates provider types with adds children to AllFormMethods
 */
export declare type FieldArrayFormProviderProps<TFieldValues extends FieldValues = FieldValues> = {
  children: React.ReactNode;
} & AllFormMethods<TFieldValues>;
