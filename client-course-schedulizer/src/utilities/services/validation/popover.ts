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
export const removeUncheckedValues = (valueArr: string[]) => {
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
    .integer()
    .min(0)
    .transform(emptyStringToNull)
    .nullable(),
  day10Used: number()
    .typeError("day 10 used must be a number")
    .integer()
    .min(0)
    .transform(emptyStringToNull)
    .nullable(),
  days: array().transform(removeUncheckedValues),
  deliveryMode: string().nullable(),
  department: string().nullable(),
  duration: number()
    .typeError("duration must be a number")
    .integer()
    .min(0)
    .transform(emptyStringToNull)
    .nullable(),
  facultyHours: number()
    .required()
    .typeError("faculty hours must be a number")
    .min(0)
    .test("is-decimal", "invalid decimal", decimalRegex),
  globalMax: number()
    .typeError("global max must be a number")
    .integer()
    .min(0)
    .transform(emptyStringToNull)
    .nullable(),
  instructionalMethod: string().nullable(),
  instructor: array().of(string()).required(),
  localMax: number()
    .typeError("global max must be a number")
    .integer()
    .min(0)
    .transform(emptyStringToNull)
    .nullable(),
  location: string().nullable(),
  name: string().nullable(),
  number: string().required().typeError("number is a required field"),
  prefix: array().of(string().uppercase()).required().typeError("prefix is a required field"),
  roomCapacity: number()
    .typeError("room capacity must be a number")
    .positive()
    .integer()
    .min(0)
    .transform(emptyStringToNull)
    .nullable(),
  section: string().required().uppercase().typeError("section is a required field"),
  status: string().nullable(),
  studentHours: number()
    .required()
    .typeError("student hours must be a number")
    .min(0)
    .test("is-decimal", "invalid decimal", decimalRegex),
  used: number()
    .typeError("used must be a number")
    .integer()
    .min(0)
    .transform(emptyStringToNull)
    .nullable(),
  year: number()
    .typeError("year must be a number")
    .positive()
    .integer()
    .min(1970)
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
  instructor: array().of(string()).required(),
  terms: array().transform(removeUncheckedValues),
});
