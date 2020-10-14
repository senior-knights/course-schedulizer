enum Semester {
  Fall = "FA",
  Interim = "IN", // TODO: Remove?
  Spring = "SP",
  Summer = "SU", // TODO: Is this a thing?
}

enum Half {
  First = "first",
  Full = "full",
  Second = "second",
}

interface Location {
  building: string;
  roomCapacity: number;
  roomNumber: string;
}

interface Meeting {
  // Like "MWThF" (all days on which the given Meeting time and room is applicable)
  days: string;
  // In minutes (usually 50)
  length: number;
  location: Location;
  // Like "8:00AM" or "12:30PM"
  startTime: string;
}

interface Instructor {
  firstName: string;
  lastName: string;
}

interface Course {
  facultyHours: number;
  name: string;
  number: string;
  prefix: string[];
  studentHours: number;
}

interface Section {
  anticipatedSize: number;
  comments: string;
  course: Course;
  // Overrides Course value
  facultyHours?: number;
  globalMax: number;
  half: Half;
  instructors: Instructor[];
  letter: string;
  localMax: number;
  // Multiple Meetings possible if time/room differs on different days
  meetings: Meeting[];
  semester: Semester;
  // Overrides Course value
  studentHours?: number;
  year: number;
}
