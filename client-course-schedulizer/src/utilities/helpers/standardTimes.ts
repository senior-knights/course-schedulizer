import { legalTimes, Meeting} from "utilities";


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

export const isStandardTime = (meeting: Meeting): boolean => {
    let isStandard = true;
    meeting.days.forEach((day) => {
        const sessionStr = `${day} -- ${meeting.startTime} -- ${meeting.duration}`;
      if (! legalTimes.has(sessionStr)) {
        isStandard =  false;
      }
    })
    return isStandard;
};