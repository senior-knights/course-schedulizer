/* eslint-disable typescript-sort-keys/string-enum */

export enum Term {
  Fall = "FA",
  Interim = "IN", // TODO: Remove?
  Spring = "SP",
  Summer = "SU", // TODO: Is this a thing?
}

export enum SemesterLength {
  Full = "Full",
  HalfFirst = "First",
  HalfSecond = "Second",
  IntensiveA = "A",
  IntensiveB = "B",
  IntensiveC = "C",
  IntensiveD = "D",
}

export enum Half {
  First = SemesterLength.HalfFirst,
  Second = SemesterLength.HalfSecond,
}

export enum Intensive {
  A = SemesterLength.IntensiveA,
  B = SemesterLength.IntensiveB,
  C = SemesterLength.IntensiveC,
  D = SemesterLength.IntensiveD,
}

export enum SemesterLengthOption {
  FullSemester = "Full",
  HalfSemester = "Half",
  IntensiveSemester = "Intensive",
  CustomSemester = "Custom",
}
