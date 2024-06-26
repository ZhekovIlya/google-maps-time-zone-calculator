"use client";

import { useEffect, useState } from "react";
import styles from '../styles/timeZoneCalculator.module.css';
import { TimeInfo, TimeZoneCalculatorProps } from "../utils/types";
import { DEFAULT_TIME_LABEL, addTimeDiffSign, adjustTimeToTwoDigits, calculateLocalTimeAndOffset, getTimezone, getUtcTimestamp, useStaticDate } from "../utils/utils";

import TimeZoneRow from "./timeZoneRow";

export default function TimeZoneCalculator({ markers, setMarkers }: TimeZoneCalculatorProps) {

    const staticDate = useStaticDate();
    const defaultTimeInfo = {
        label: DEFAULT_TIME_LABEL,
        time: `${adjustTimeToTwoDigits(staticDate.getUTCHours().toString())}:${adjustTimeToTwoDigits(staticDate.getUTCMinutes().toString())}`,
    }
    const [selectedRowId, setSelectedRowId] = useState<string>();
    const [selectedTimeInfo, setSelectedTimeInfo] = useState<TimeInfo>(defaultTimeInfo);

    const handleResetAll = () => {
        setSelectedTimeInfo(defaultTimeInfo);
        setSelectedRowId('');
        setMarkers([]);
    };

    useEffect(() => {
        const curMarker = markers[markers.length - 1];
        const curMarkerPosition = curMarker?.position;

        if (curMarkerPosition && !curMarker.localTime) {
            getTimezone(`${curMarkerPosition.lat},${curMarkerPosition.lng}`, getUtcTimestamp(staticDate)).then(
                res => {
                    if (typeof res == 'string' || res.status == 'ZERO_RESULTS') {
                        setMarkers((prevMarkers) => {
                            return prevMarkers.filter(marker => marker.id !== curMarker.id);
                        });
                        return;
                    }

                    setMarkers((prevMarkers) => {
                        return prevMarkers.map(marker => {
                            if (marker.id === curMarker.id) {
                                const { timeZoneUTCTime, localTimeToUTCdiff } = calculateLocalTimeAndOffset(res, staticDate);
                                const selectedRowOffset = selectedRowId ? markers.find(marker => marker.id === selectedRowId)?.diffToUTC : 0;
                                const localTimeToSelectedDiff = addTimeDiffSign(+localTimeToUTCdiff - +selectedRowOffset);

                                return {
                                    ...marker, timezone: res, localTime: timeZoneUTCTime, diffToUTC: localTimeToUTCdiff,
                                    diffToSelected: localTimeToSelectedDiff
                                };
                            }
                            return marker;
                        })
                    })
                }
            )
        }
    }, [markers.length]);

    const getInfoTooltip = () => {
        return (
            <div className={styles.tooltip}>
                Need help?
                <div className={styles.tooltipText}>
                    Start with selecting locations on map
                    <br />
                    Rows are clickable and provide a recalculations on click
                    <br />
                    Press `Reset All` button in order to wipe all changes
                </div>
            </div>
        )
    }

    return (
        <>
            <div className={styles.calculatorHeader}>
                <div className={styles.selectedTime}>
                    <label htmlFor="selected-time" className={styles.selectedTimeLabel}>{selectedTimeInfo.label}</label>
                    <div id="selected-time" className={styles.selectedTimeValue}>{selectedTimeInfo.time}</div>
                </div>
                {getInfoTooltip()}
                <button className={styles.resetAll} onClick={handleResetAll}>Reset All</button >
            </div>
            <div className={styles.markersList}>
                {
                    markers?.map(
                        marker => marker.timezone &&
                            <TimeZoneRow
                                key={marker.id}
                                marker={marker}
                                selectedRowId={selectedRowId}
                                setSelectedTimeInfo={setSelectedTimeInfo}
                                setSelectedRowId={setSelectedRowId}
                                setMarkers={setMarkers}
                            />
                    )
                }
            </div>
        </>
    );
}
