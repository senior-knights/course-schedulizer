import { array, number, object, string } from "yup";

/*
helper for yup transform function
Ref: https://github.com/jquense/yup/issues/298#issuecomment-559017330
 */
const emptyStringToNull = <T>(value: T, originalValue: T) => {
  if (typeof originalValue === "string" && originalValue === "") {
    return null;
  }
  return value;
};

/*
  Removes unchecked days from the list. Helper for yup
*/
const removeUncheckedValues = (valueArr: string[]) => {
  return valueArr.filter((value: boolean | string) => {
    return value;
  });
};

/*
  Tests that a number is an integer or a decimal.
  Ref: https://stackoverflow.com/questions/59269772/formik-yup-how-to-check-is-decimal-number
*/
const decimalRegex = (value: number | null | undefined): boolean => {
  return Boolean(`${value || ""}`.match(/^\d*\.?\d*$/)) || false;
};

/* A schema to provide form validation for the AddSectionPopover.
NOTE: fields with default values are not check: semester and time. */
export const addSectionSchema = object().shape({
  anticipatedSize: number()
    .typeError("global max must be a number")
    .positive()
    .integer()
    .transform(emptyStringToNull)
    .nullable(),
  day10Used: number()
    .typeError("day 10 used must be a number")
    .positive()
    .integer()
    .transform(emptyStringToNull)
    .nullable(),
  days: array().transform(removeUncheckedValues),
  department: string(),
  duration: number()
    .typeError("duration must be a number")
    .positive()
    .integer()
    .transform(emptyStringToNull)
    .nullable(),
  facultyHours: number()
    .typeError("faculty hours must be a number")
    .positive()
    .test("is-decimal", "invalid decimal", decimalRegex)
    .transform(emptyStringToNull)
    .nullable(),
  globalMax: number()
    .typeError("global max must be a number")
    .positive()
    .integer()
    .transform(emptyStringToNull)
    .nullable(),
  instructionalMethod: string(),
  instructor: string(),
  localMax: number()
    .typeError("global max must be a number")
    .positive()
    .integer()
    .transform(emptyStringToNull)
    .nullable(),
  location: string(),
  name: string(),
  number: string().required(),
  prefix: string().required().uppercase(),
  roomCapacity: number()
    .typeError("room capacity must be a number")
    .positive()
    .integer()
    .transform(emptyStringToNull)
    .nullable(),
  section: string().required().uppercase(),
  status: string(),
  studentHours: number()
    .typeError("student hours must be a number")
    .positive()
    .integer()
    .test("is-decimal", "invalid decimal", decimalRegex)
    .transform(emptyStringToNull)
    .nullable(),
  used: number()
    .typeError("used must be a number")
    .positive()
    .integer()
    .transform(emptyStringToNull)
    .nullable(),
  year: number()
    .typeError("year must be a number")
    .positive()
    .integer()
    .transform(emptyStringToNull)
    .nullable(),
});

export const addNonTeachingLoadSchema = object().shape({
  activity: string().required(),
  facultyHours: number()
    .required()
    .typeError("faculty hours must be a number")
    .positive()
    .test("is-decimal", "invalid decimal", decimalRegex)
    .transform(emptyStringToNull)
    .nullable(),
  instructor: string().required(),
  terms: array().transform(removeUncheckedValues),
});
