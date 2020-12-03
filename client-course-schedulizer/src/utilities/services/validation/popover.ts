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

/* A schema to provide form validation for the AddSectionPopover.
NOTE: fields with default values are not check: semester and time. */
export const addSectionSchema = object().shape({
  anticipatedSize: number()
    .typeError("global max must be a number")
    .positive()
    .integer()
    .transform(emptyStringToNull)
    .nullable(),
  days: array().transform(removeUncheckedValues).min(1),
  duration: number().typeError("duration must be a number").required().positive().integer(),
  facultyHours: number()
    .typeError("faculty hours must be a number")
    .required()
    .positive()
    .integer(),
  globalMax: number()
    .typeError("global max must be a number")
    .positive()
    .integer()
    .transform(emptyStringToNull)
    .nullable(),
  instructor: string().required(),
  localMax: number()
    .typeError("global max must be a number")
    .positive()
    .integer()
    .transform(emptyStringToNull)
    .nullable(),
  location: string().required(),
  name: string().required(),
  number: number().typeError("number must be a number").required().positive().integer(),
  prefix: string().required().uppercase(),
  roomCapacity: number().typeError("global max must be a number").positive().integer(),
  section: string().required().uppercase(),
  studentHours: number()
    .typeError("student hours must be a number")
    .required()
    .positive()
    .integer(),
});
