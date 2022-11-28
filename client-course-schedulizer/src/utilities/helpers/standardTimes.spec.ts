import { Day, isStandardTime, militaryTo12Hour } from "utilities";

const test_times = [
    {time: "12:15", out: "12:15 PM"},
    {time: "10:15", out: "10:15 AM"},
    {time: "14:15", out: "2:15 PM"},
]
const test_meetings = 
[
    {meeting : {  
        days: [Day.Monday, Day.Wednesday, Day.Friday],
        startTime: "9:15 AM",
        duration: 65, 
        location: {building: "NH", roomNumber: "276"}
        }, 
    out: true},
    {meeting : {  
        days: [Day.Monday],
        startTime: "1:30 PM",
        duration: 65, 
        location: {building: "NH", roomNumber: "276"}
        }, 
    out: true},
    {meeting : {  
        days: [Day.Friday],
        startTime: "1:30 PM",
        duration: 65, 
        location: {building: "NH", roomNumber: "276"}
        }, 
    out: true},
    {meeting : {  
        days: [Day.Monday, Day.Wednesday, Day.Friday],
        startTime: "1:30 PM",
        duration: 65, 
        location: {building: "NH", roomNumber: "276"}
        }, 
    out: true},
    {meeting : {  
        days: [Day.Monday, Day.Friday],
        startTime: "1:30 PM",
        duration: 65, 
        location: {building: "NH", roomNumber: "276"}
        }, 
    out: false},
    {meeting : {  
        days: [Day.Tuesday, Day.Thursday],
        startTime: "8:00 AM",
        duration: 100, 
        location: {building: "NH", roomNumber: "276"}
        }, 
    out: true},
    {meeting : {  
        days: [Day.Thursday],
        startTime: "8:00 AM",
        duration: 100, 
        location: {building: "NH", roomNumber: "276"}
        }, 
    out: true}
];

test_times.forEach( (test_case) => {
  test(`correctly converting from military to 12-hour times`, () => {
    expect(militaryTo12Hour(test_case.time)).toEqual(test_case.out);
  });
});
test_meetings.forEach( (test_case) => {
  test(`correctly identify standard meeting times ${test_case.meeting.days.join("")} @ ${test_case.meeting.startTime} for ${test_case.meeting.duration} mins`, 
  () => {
    expect(isStandardTime(test_case.meeting)).toEqual(test_case.out);
  });
});