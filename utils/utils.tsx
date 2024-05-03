import { useEffect, useState } from "react";
import { Timezone } from "./types";

export async function getTimezone(latLng: string, timeStamp: string) {
    try {
        const params = new URLSearchParams();
        params.append('location', latLng);
        params.append('timestamp', timeStamp);
        params.append('key', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

        const response = await fetch('https://maps.googleapis.com/maps/api/timezone/json?' + params, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = (await response.json()) as Timezone;

        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.log('error message: ', error.message);
            return error.message;
        } else {
            console.log('unexpected error: ', error);
            return 'An unexpected error occurred';
        }
    }
};

export function adjustTimeToTwoDigits(time: string) {
    return time.padStart(2, '0');
};

export function calculateLocalTimeAndOffset(timezone: Timezone, utcTime: Date) {
    const localTimeZoneHoursOffset = (timezone.dstOffset + timezone.rawOffset) / MAX_SECONDS_AND_MINUTES / MAX_SECONDS_AND_MINUTES;
    let localTimeZoneHours = Math.floor(utcTime.getUTCHours() + localTimeZoneHoursOffset);
    if (localTimeZoneHours >= MAX_HOURS) {
        localTimeZoneHours -= MAX_HOURS;
    }
    let localTimeZoneMinutes = utcTime.getUTCMinutes();

    if (localTimeZoneHoursOffset % 1 > 0) {
        localTimeZoneMinutes += MAX_SECONDS_AND_MINUTES * (localTimeZoneHoursOffset % 1);
        if (localTimeZoneMinutes >= MAX_SECONDS_AND_MINUTES) {
            localTimeZoneMinutes -= MAX_SECONDS_AND_MINUTES;
            localTimeZoneHours += 1;
        }
    }

    const timeZoneUTCTime = `${adjustTimeToTwoDigits(localTimeZoneHours.toString())}:${adjustTimeToTwoDigits(localTimeZoneMinutes.toString())}`;

    const localTimeToUTCdiff = addTimeDiffSign(localTimeZoneHoursOffset);

    return { timeZoneUTCTime, localTimeToUTCdiff };
};

export function addTimeDiffSign(timeDiff: number) {
    return Math.sign(timeDiff) > -1 ? `+${timeDiff}` : `${timeDiff}`;
}

const MAX_SECONDS_AND_MINUTES = 60;
const MILLIS_IN_SECONDS = 1000;
const MAX_HOURS = 24;

export function getUtcTimestamp(date: Date) {
    return Math.floor((date.getTime() - (date.getTimezoneOffset() * MAX_SECONDS_AND_MINUTES* MILLIS_IN_SECONDS)) / MILLIS_IN_SECONDS).toString();
}


export const useStaticDate = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        setDate(new Date());
    }, []);

    return date;
};

const DEFAULT_POSITION = { lat: 51.477, lng: -0.001 };
export const DEFAULT_CAMERA_POSITION = {
    center: DEFAULT_POSITION,
    zoom: 3,
};
export const DEFAULT_TIME_LABEL = "Coordinated Universal Time (UTC): ";
