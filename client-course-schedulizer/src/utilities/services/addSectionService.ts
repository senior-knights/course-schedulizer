import { Half, Intensive, SemesterLength, SemesterLengthOption } from "utilities";

export const convertFromSemesterLength = (sl: SemesterLength | undefined): SemesterLengthOption => {
  if (sl === SemesterLength.Full || !sl) {
    return SemesterLengthOption.FullSemester;
  }
  if (sl === SemesterLength.HalfFirst || sl === SemesterLength.HalfSecond) {
    return SemesterLengthOption.HalfSemester;
  }

  return SemesterLengthOption.IntensiveSemester;
};

export const convertToSemesterLength = (
  sl: Half | Intensive | SemesterLengthOption,
): SemesterLength => {
  switch (sl) {
    case Half.First:
      return SemesterLength.HalfFirst;
    case Half.Second:
      return SemesterLength.HalfSecond;
    case Intensive.A:
      return SemesterLength.IntensiveA;
    case Intensive.B:
      return SemesterLength.IntensiveB;
    case Intensive.C:
      return SemesterLength.IntensiveC;
    case Intensive.D:
      return SemesterLength.IntensiveD;
    default:
      return SemesterLength.Full;
  }
};
