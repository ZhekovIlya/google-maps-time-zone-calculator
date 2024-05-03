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
    const localTimeZoneHoursOffset = (timezone.dstOffset + timezone.rawOffset) / 3600;
    let localTimeZoneHours = Math.floor(utcTime.getUTCHours() + localTimeZoneHoursOffset);
    if (localTimeZoneHours >= 24) {
        localTimeZoneHours -= 24;
    }
    let localTimeZoneMinutes = utcTime.getUTCMinutes();

    if (localTimeZoneHoursOffset % 1 > 0) {
        localTimeZoneMinutes += 60 * (localTimeZoneHoursOffset % 1);
        if (localTimeZoneMinutes >= 60) {
            localTimeZoneMinutes -= 60;
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

export const DATE = new Date();

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
