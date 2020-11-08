// Copied from Context from the Chrome inspector

export const fakeSchedule = {
  courses: [
    {
      facultyHours: 4.5,
      name: "Logic and Complexity",
      number: "312",
      prefixes: ["MATH", "CS", "PHIL"],
      sections: [
        {
          anticipatedSize: 27,
          comments: "This class counts for both CS and Math credit.",
          globalMax: 30,
          instructors: [{ firstName: "Paul", lastName: "Erdos" }],
          letter: "A",
          localMax: 20,
          meetings: [
            {
              days: ["M", "W", "Th", "F"],
              duration: 50,
              location: { building: "NH", roomCapacity: 30, roomNumber: "232" },
              startTime: "12:30 PM",
            },
          ],
          semesterLength: "A",
          term: "FA",
          year: 2020,
        },
        {
          anticipatedSize: 27,
          comments: "This class counts for both CS and Math credit.",
          globalMax: 30,
          instructors: [{ firstName: "Paul", lastName: "Erdos" }],
          letter: "B",
          localMax: 20,
          meetings: [
            {
              days: ["M", "W", "Th", "F"],
              duration: 50,
              location: { building: "NH", roomCapacity: 30, roomNumber: "232" },
              startTime: "1:30 PM",
            },
          ],
          semesterLength: "D",
          term: "FA",
          year: "2020-2021",
        },
      ],
      studentHours: 4,
    },
    {
      facultyHours: 2,
      name: "Computer Architecture Lab",
      number: "220L",
      prefixes: ["ENGR"],
      sections: [
        {
          anticipatedSize: 15,
          comments: "This class is a lab for ENGR 220.",
          globalMax: 20,
          instructors: [{ firstName: "Srinivasa", lastName: "Ramanujan" }],
          letter: "C",
          localMax: 10,
          meetings: [
            {
              days: ["T", "Th"],
              duration: 80,
              location: { building: "SB", roomCapacity: 20, roomNumber: "011A" },
              startTime: "6:00 PM",
            },
          ],
          semesterLength: "First",
          term: "SP",
          year: 2020,
        },
        {
          anticipatedSize: 15,
          comments: "This class is a lab for ENGR 220.",
          globalMax: 20,
          instructors: [{ firstName: "Srinivasa", lastName: "Ramanujan" }],
          letter: "A",
          localMax: 10,
          meetings: [
            {
              days: ["M", "W", "F"],
              duration: 50,
              location: { building: "SB", roomCapacity: 20, roomNumber: "011A" },
              startTime: "6:00 PM",
            },
          ],
          semesterLength: "First",
          term: "SP",
          year: 2020,
        },
      ],
      studentHours: 1.5,
    },
    {
      facultyHours: 5,
      name: "Statistics Theory",
      number: "327",
      prefixes: ["MATH", "STAT"],
      sections: [
        {
          anticipatedSize: 30,
          comments: "",
          globalMax: 35,
          instructors: [{ firstName: "Thomas", lastName: "Bayes" }],
          letter: "B",
          localMax: 25,
          meetings: [
            {
              days: ["M", "F"],
              duration: 110,
              location: {
                building: "Prince Conference Center",
                roomCapacity: 40,
                roomNumber: "GHWE",
              },
              startTime: "8:00 AM",
            },
          ],
          semesterLength: "Second",
          term: "SU",
          year: 2020,
        },
      ],
      studentHours: 4,
    },
    {
      facultyHours: 3,
      name: "Prime Number Theory",
      number: "337",
      prefixes: ["MATH"],
      sections: [
        {
          anticipatedSize: 180,
          comments: "",
          globalMax: 180,
          instructors: [
            { firstName: "Leonhard", lastName: "Euler" },
            { firstName: "Bernhard", lastName: "Riemann" },
          ],
          letter: "A",
          localMax: 100,
          meetings: [
            {
              days: ["M", "W", "F"],
              duration: 50,
              location: { building: "CFAC", roomCapacity: 200, roomNumber: "Auditorium" },
              startTime: "9:00 AM",
            },
          ],
          semesterLength: "Full",
          term: "IN",
          year: 2020,
        },
      ],
      studentHours: 3,
    },
  ],
};
