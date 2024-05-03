import { useState } from "react";
import GoogleMap from "../components/googleMap";
import TimeZoneCalculator from "../components/timeZoneCalculator";
import styles from "../styles/index.module.css";
import { MarkerProps } from "../utils/types";
export default function App() {
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  return (
    <>
     <style>{'body { overflow: hidden; }'}</style>
      <div className={styles.layout}>
        <div className={styles.map}>
          <GoogleMap markers={markers} setMarkers={setMarkers} />
        </div>
        <div className={styles.rightColumn}>
          <TimeZoneCalculator markers={markers} setMarkers={setMarkers} />
        </div>
      </div>
    </>
  );
}
