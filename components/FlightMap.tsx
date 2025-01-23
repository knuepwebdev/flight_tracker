"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneUp } from '@fortawesome/free-solid-svg-icons'
import * as React from 'react';
import { useState, useEffect, useCallback } from "react";
import Conditional from "components/Conditional";
import ReactMapGL, {
  Marker,
  Popup
} from "react-map-gl";
import GeocoderControl from 'components/GeocoderControl';

const FlightMap = () => {
  interface IViewport {
    latitude: number;
    longitude: number;
    zoom: number;
  };

  const defaultViewport = {
    latitude: 33.94,
    longitude: -118.40,
    zoom: 10    
  };
  const [viewport, setViewport] = useState<IViewport>(defaultViewport);
  const [flights, setFlights] = useState<(string|number)[]>([]);
  const [popupOpen, setPopupOpen] = useState({});
  const [airline, setAirline] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const pollInterval = 8000;
  const fetchArgs:RequestInit = {
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  const fetchFlights = async () => {
    const offset = 0.4;
    const latitude_min = viewport.latitude - offset;
    const latitude_max = viewport.latitude + offset;
    const longitude_min = viewport.longitude - offset;
    const longitude_max = viewport.longitude + offset;

    try {
      const resp = await fetch('/api/flights?' + new URLSearchParams({
        latitude_min: latitude_min,
        latitude_max: latitude_max,
        longitude_min: longitude_min,
        longitude_max: longitude_max
      }).toString(), fetchArgs);

      const data = await resp.json();

      setFlights([...data?.flights]);
    } catch (error) {
      console.error("error", error.message);
    }
  };

  // icao24 is a unique identifier for a flight
  const fetchFlightDetails = async (icao24, callsign) => {
    try {
      const resp = await fetch('/api/flight_details?' + new URLSearchParams({
        callsign: callsign,
        icao24: icao24
      }).toString(), fetchArgs);

      const data = await resp.json();
      setFlightDetails(data['flight_details']);
      // Use the flight's unique icao24 identifier as the flag to control popups
      setPopupOpen({ [icao24]: true });
    } catch(error) {
      console.error("error", error.message);
    }
  };

  const setFlightDetails = (flightDetails) => {
    setAirline(flightDetails?.flightroute?.airline?.name)
    setOrigin(flightDetails?.flightroute?.origin?.municipality)
    setDestination(flightDetails.flightroute?.destination?.municipality)
  }

  const convertAirspeedToKnots = (airspeedInMetersPerSecond) => {
    return Math.round(airspeedInMetersPerSecond * 1.94384);
  }

  const convertAltitudeToFeet = (altitudeInMeters) => {
    return Math.round(altitudeInMeters *3.28084)
  }

  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );  

  useEffect(() => {
    fetchFlights();
    // setInterval(fetchFlights, pollInterval);
  }, []);

  return (
    <ReactMapGL
      reuseMaps
      {...viewport}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
      onLoad={ (event) => event.target.resize() }
      onMove={ event => setViewport(event.viewState) }
      onMoveEnd={ event => fetchFlights() }
      style={{width: '100vw', height: '100vh'}}
      >

      <GeocoderControl
        mapboxAccessToken={ process.env.NEXT_PUBLIC_MAPBOX_TOKEN }
        position="top-left"
        zoom={ viewport.zoom.toString() }
      />

    { flights?.map(flight => (
      <div key={ flight[0] }>
        <Marker
          longitude={ flight[5] }
          latitude={ flight[6] }
          onClick={ (event) => {
            event.originalEvent.stopPropagation();
            fetchFlightDetails(flight[0], flight[1]);
          }}
        >
          <FontAwesomeIcon
            icon={faPlaneUp}
            size="2xl"
            transform={{ rotate: Math.round(flight[10]) }}
          />
        </Marker>
        <Conditional showWhen={ Boolean(popupOpen[flight[0]]) }>
          <Popup
            longitude={ flight[5] }
            latitude={ flight[6] }
            anchor="bottom"
          >
            <Conditional showWhen={ Boolean(airline) }>
              <div>Airline: { airline } </div>
            </Conditional>
            
            <div>Callsign: { flight[1] }</div>
            <div>Altitude: { convertAltitudeToFeet(flight[13]) } ft</div>
            <div>Speed: { convertAirspeedToKnots(flight[9])} knots</div>
            <Conditional showWhen={ Boolean(origin) }>
              <div>Origin: { origin } </div>
            </Conditional>
            <Conditional showWhen={ Boolean(destination) }>
              <div>Destination: { destination }</div>
            </Conditional>
          </Popup>
        </Conditional>  
      </div>
    ))}

    </ReactMapGL>
  );
}

export default FlightMap;
