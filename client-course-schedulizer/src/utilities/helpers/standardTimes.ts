import { legalTimes, Meeting, MeetingPattern} from "utilities";


// convert from 14:45 to 2:45 PM, etc.
export const militaryTo12Hour = (time: string): string => {
    const [hour, minute] = time.split(':');
    if (parseInt(hour) < 12) { 
        return `${time} AM`;
    } 
    if (parseInt(hour) === 12) {
        return `${time} PM`;
    }
    return `${(parseInt(hour) - 12)}:${minute} PM`;
};

militaryTo12Hour('15:15');

export const meetingPatternCode = (meeting: MeetingPattern): string => {
    // collapse days to a string if it is a list
    let days = typeof meeting.days === 'string' ? meeting.days : meeting.days.join("");
    days = days.replace('R', 'TH')

    return `${days} @ ${meeting.startTime} for ${meeting.duration} mins`
}

export const isStandardTime = (meeting: Meeting, strict = true): boolean => {
    if (strict) {
      return legalTimes.has(meetingPatternCode(meeting));
    } 
    // replace this with a looser test that allows matching a subset of days
    return legalTimes.has(meetingPatternCode(meeting));
};