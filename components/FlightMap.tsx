"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneUp } from '@fortawesome/free-solid-svg-icons'
import * as React from 'react';
import { useState, useEffect } from "react";
import Conditional from "components/Conditional";
import ReactMapGL, {
  Marker,
  Popup
} from "react-map-gl";

const FlightMap = () => {
  interface IViewport {
    latitude: number;
    longitude: number;
    zoom: number;
  };

  const [viewport, setViewport] = useState<IViewport>({
    latitude: 33.94,
    longitude: -118.40,
    zoom: 10
  });

  const [flights, setFlights] = useState([]);
  const [popupOpen, setPopupOpen] = useState({});
  const [airline, setAirline] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const pollInterval = 8000;
  const fetchArgs = {
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  const fetchFlights = async () => {
    try {
      const resp = await fetch('/api/flights', fetchArgs);
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
            fetchFlightDetails(flight[0], flight[1]);
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
            <Conditional showWhen={ airline }>
              <div>Airline: { airline } </div>
            </Conditional>
            
            <div>Callsign: { flight[1] }</div>
            <div>Altitude: { convertAltitudeToFeet(flight[13]) } ft</div>
            <div>Speed: { convertAirspeedToKnots(flight[9])} knots</div>
            <Conditional showWhen={ origin }>
              <div>Origin: { origin } </div>
            </Conditional>
            <Conditional showWhen={ destination }>
              <div>Destination: { destination }</div>
            </Conditional>
          </Popup>
        )}        
      </div>
    ))}

    </ReactMapGL>
  );
}

export default FlightMap;
