"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneUp } from '@fortawesome/free-solid-svg-icons'
faPlaneUp
import * as React from 'react';
import { useState, useEffect } from "react";
import ReactMapGL, {
  Marker,
  Popup
} from "react-map-gl";

const FlightMap = () => {
  const [viewport, setViewport] = useState({
    latitude: 33.94,
    longitude: -118.40,
    zoom: 10,
  });

  const [flights, setFlights] = useState([]);
  const [popupOpen, setPopupOpen] = useState({});
  const pollInterval = 8000;

  const fetchFlights = async () => {
    try {
      const response = await fetch('/api/flights', {
        cache: 'no-store',
        next: { revalidate: 0 },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      setFlights([...data?.flights]);
    } catch (error) {
      console.error("error", error.message);
    }
  };

  const convertAirspeedToKnots = (airspeedInMetersPerSecond) => {
    return Math.round(airspeedInMetersPerSecond * 1.94384);
  }

  const convertAltitudeToFeet = (altitudeInMeters) => {
    return Math.round(altitudeInMeters *3.28084)
  }

  useEffect(() => {
    fetchFlights();
    setInterval(fetchFlights, pollInterval);
  }, []);

  return (
    <ReactMapGL
      reuseMaps
      {...viewport}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
      onLoad={(event) => event.target.resize()}
      onMove={event => setViewport(event.viewState)}
      style={{width: '100vw', height: '100vh'}}
      >

    { flights?.map(flight => (
      <div key={ flight[0] }>
        <Marker
          longitude={ flight[5] }
          latitude={ flight[6] }
          onClick={ (event) => {
            event.originalEvent.stopPropagation();
            // Use the flight's unique icao24 identifier as the flag to control popups
            setPopupOpen({ [flight[0]]: true });
          }}
        >
          <FontAwesomeIcon
            icon={faPlaneUp}
            size="2xl"
            transform={{ rotate: Math.round(flight[10]) }}
          />
        </Marker>
        { popupOpen[flight[0]] && (
          <Popup
            longitude={ flight[5] }
            latitude={ flight[6] }
            anchor="bottom"
          >
            <div>Callsign: { flight[1] }</div>
            <div>Altitude: { convertAltitudeToFeet(flight[13]) } ft</div>
            <div>Speed: { convertAirspeedToKnots(flight[9])} knots</div>
          </Popup>
        )}        
      </div>
    ))}

    </ReactMapGL>
  );
}

export default FlightMap;
