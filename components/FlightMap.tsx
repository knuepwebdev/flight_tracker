"use client";

import * as React from 'react';
import { useState, useEffect, useContext } from "react";
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

  const fetchFlights = async () => {
    const longitude = viewport?.longitude;
    const latitude = viewport?.latitude;
    const radius = 25; // radius in nautical miles
    const url = `https://aviation-edge.com/v2/public/flights?lat=${latitude}&lng=${longitude}&distance=${radius}&status=en-route&key=${process.env.NEXT_PUBLIC_AVIATION_EDGE_API_KEY}`
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      setFlights(data);

    } catch (error) {
      console.error("error", error.message);
    }
  };  

  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      dragPan={true}
      interactiveZoom={true} // Enables zoom with scroll
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
      onLoad={(event) => event.target.resize()}
      style={{width: '100vw', height: '100vh'}}
      >
    { flights?.map(flight => (
      <div key={ flight.flight?.icaoNumber }>
        <Marker longitude={ flight.geography?.longitude } latitude={ flight.geography?.latitude }>

          
        </Marker>
        
      </div>

    ))}

    </ReactMapGL>
  );
}

export default FlightMap;
