"use client";

import styles from '../styles/timeZoneRow.module.css';
import { TimeZoneRowProps } from '../utils/types';
import { addTimeDiffSign } from '../utils/utils';

export default function TimeZoneRow({ marker, selectedRowId: selectedRowId, setSelectedTimeInfo, setSelectedRowId: setSelectedRowId, setMarkers }: TimeZoneRowProps) {

    const handleSelectTime = () => {
        setSelectedTimeInfo({
            label: `${marker.timezone?.timeZoneName} ${marker.diffToUTC} UTC`,
            time: marker.localTime,
        });

        setSelectedRowId(marker.id);

        setMarkers((prevMarkers) => {
            return prevMarkers.map((el) => {
                if (el.id === marker.id) {
                    return { ...el, diffToSelected: '', selected: true };
                } else {
                    const localTimeToSelectedDiff = addTimeDiffSign(+el.diffToUTC - +marker.diffToUTC);
                    return { ...el, diffToSelected: localTimeToSelectedDiff, selected: false };
                }
            });
        });
    };

    const locationInfo = () => {
        const timeZoneAbbriveature = marker.timezone?.timeZoneName.split(' ').map((el: string) => el.at(0).toUpperCase()).join('');
        const diffToUTC = `${marker.diffToUTC} UTC`;
        return (
            <div className={styles.locationInfo}>
                <span className={styles.locationName}>{marker.timezone?.timeZoneId}</span>
                <div className={styles.locationTimeZone}>
                    {timeZoneAbbriveature} {diffToUTC}
                    <span className={styles.locationTimeZoneTooltip}>{marker.timezone?.timeZoneName}</span>
                </div>
            </div>
        );
    }

    const beautifyDiffToSelected = (diffToSelected: string) => {
        return +diffToSelected > 0 ? `${Math.abs(+diffToSelected)} hour(s) ahead` : `${Math.abs(+diffToSelected)} hour(s) behind`;
    }

    const timeDifferenceToSelectedRow = () => {
        const diffToSelected = !!selectedRowId && selectedRowId != marker.id && Math.abs(+marker.diffToSelected) != 0 ? beautifyDiffToSelected(marker.diffToSelected) : '';
        return <span className={styles.selectedDiff}>{diffToSelected}</span>
    }

    return (
        <div className={styles.timeZoneRow} key={marker.id} onClick={handleSelectTime}>
            {locationInfo()}
            {timeDifferenceToSelectedRow()}
            <span className={styles.localTime}>{marker.localTime}</span>
        </div>
    );
};

