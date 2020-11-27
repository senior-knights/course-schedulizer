import { SemesterLength, SemesterLengthOption } from "utilities/interfaces";

export const convertSemesterLength = (sl: SemesterLength | undefined) => {
  if (sl === SemesterLength.Full || !sl) {
    return SemesterLengthOption.FullSemester;
  }
  if (sl === SemesterLength.HalfFirst || sl === SemesterLength.HalfSecond) {
    return SemesterLengthOption.HalfSemester;
  }

  return SemesterLengthOption.IntensiveSemester;
};
