"use client";

import {
    APIProvider,
    AdvancedMarker,
    Map,
    MapCameraChangedEvent,
    MapCameraProps,
    MapMouseEvent
} from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import { GoogleMapProps } from "../utils/types";
import { DEFAULT_CAMERA_POSITION } from "../utils/utils";

export default function GoogleMap({ markers, setMarkers }: GoogleMapProps) {

    const [cameraProps, setCameraProps] = useState<MapCameraProps>(DEFAULT_CAMERA_POSITION);

    const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => setCameraProps(ev.detail), []);
    const handleMapClick = (ev: MapMouseEvent) => setMarkers([...markers, { position: ev.detail.latLng, id: JSON.stringify(ev.detail) }]);

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <div style={{ height: "98vh" }}>
                <Map {...cameraProps} mapId={process.env.NEXT_PUBLIC_MAP_ID} disableDefaultUI={true}
                    onCameraChanged={handleCameraChange}
                    onClick={handleMapClick}>
                    {markers?.map(
                        marker => <AdvancedMarker key={marker.id} position={marker.position} />
                    )}
                </Map>
            </div>
        </APIProvider>
    );
}
