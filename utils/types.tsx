export type MarkerProps = {
    position: google.maps.LatLngLiteral
    id: string
    timezone?: Timezone
    localTime?: string
    diffToUTC?: string
    diffToSelected?: string
    selected?: boolean
};

export type Timezone = {
    dstOffset: number
    rawOffset: number
    status: string
    timeZoneId: string
    timeZoneName: string
};

export type GoogleMapProps = {
    markers: MarkerProps[]
    setMarkers: React.Dispatch<React.SetStateAction<MarkerProps[]>>
};

export type TimeZoneCalculatorProps = {
    markers: MarkerProps[]
    setMarkers: React.Dispatch<React.SetStateAction<MarkerProps[]>>
};

export type TimeZoneRowProps = {
    marker: MarkerProps
    selectedRowId: string
    setMarkers: React.Dispatch<React.SetStateAction<MarkerProps[]>>
    setSelectedRowId: React.Dispatch<React.SetStateAction<string>>
    setSelectedTimeInfo: React.Dispatch<React.SetStateAction<TimeInfo>>
};

export type TimeInfo = {
    label: string
    time: string
};

export type SelectedRowInfo = {
    id: string
    offsetUTC: string
};