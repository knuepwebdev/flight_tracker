"use client";

import * as React from 'react';
import Map from 'react-map-gl';

function FlightMap() {
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        longitude: -118.40,
        latitude: 33.94,
        zoom: 11
      }}
      style={{width: 600, height: 400}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}

export default FlightMap;
