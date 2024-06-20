import { differenceInMilliseconds } from 'date-fns';

export function formatDateTime(datetimeString: string) {
    const date = new Date(datetimeString);
    // Get date format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
    const day = String(date.getDate()).padStart(2, '0');

    // Create date format string
    const formattedDate = `${year}-${month}-${day}`;

    // Calc the time (hours, minutes, seconds)
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // If hour is 0 then convert to 12

    // Create AM / PM string
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return { formattedDate, formattedTime };
}

export function calcMinutes(startTimeString: string, endTimeString: string) {
    // Convert from string to Date
    const startTime = new Date(startTimeString);
    const endTime = new Date(endTimeString);

    // Calc difference by milliseconds
    const milliseconds = endTime.getTime() - startTime.getTime();

    // Convert from milliseconds to seconds
    const minutes = Math.floor(milliseconds / (1000 * 60));

    return minutes;
}

export const invalidateDateTime = (startTime: Date, endTime: Date) => {
    return differenceInMilliseconds(startTime, endTime) >= 0;
};

export const compareDate = (startTime: string) => {
    const now = new Date()
    const date = now.toISOString();
    const dateComparison = differenceInMilliseconds(startTime, date);
    if (dateComparison >= 0) return 1;
    return -1;
};
