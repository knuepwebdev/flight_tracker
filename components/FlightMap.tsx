"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneUp } from '@fortawesome/free-solid-svg-icons'
faPlaneUp
import * as React from 'react';
import { useState, useEffect } from "react";
import ReactMapGL, {
  Marker,
  Source,
  Layer,
} from "react-map-gl";

const FlightMap = () => {
  const [viewport, setViewport] = useState({
    latitude: 33.94,
    longitude: -118.40,
    zoom: 10,
  });

  const [flights, setFlights] = useState([]);
  const longitude = viewport?.longitude;
  const latitude = viewport?.latitude;
  const pollInterval = 3000
  const url = 'https://opensky-network.org/api/states/all?lamin=33.59700&lomin=-118.540534&lamax=34.078360&lomax=-117.824706';
  const headers = new Headers({
    'Authorization': `Basic ${btoa(process.env.NEXT_PUBLIC_OPENSKY_USERNAME + ':' + process.env.NEXT_PUBLIC_OPENSKY_PASSWORD)}`
  });

  const fetchFlights = async () => {
    try {
      const response = await fetch(url, { headers: headers });
      const data = await response.json();

      setFlights([...data.states]);
    } catch (error) {
      console.error("error", error.message);
    }
  };

  useEffect(() => {
    fetchFlights();
    // setTimeout(fetchFlights, 3000);
    // setTimeout(fetchFlights, 6000);
    // setTimeout(fetchFlights, 7000);
    // setInterval(fetchFlights, pollInterval);
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      interactiveZoom={true} // Enables zoom with scroll
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
      onLoad={(event) => event.target.resize()}
      style={{width: '100vw', height: '100vh'}}
      >

    { flights?.map(flight => (
      <div key={ flight[0] }>
        <Marker longitude={ flight[5] } latitude={ flight[6] }>
          <FontAwesomeIcon icon={faPlaneUp} size="2xl" />
        </Marker>
      </div>
    ))}

    </ReactMapGL>
  );
}

export default FlightMap;
