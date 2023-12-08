
// App.js

import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { decode } from '@googlemaps/polyline-codec';
import axios from 'axios';
import "./App.css";

const App = () => {
  const [route, setRoute] = useState([]);
  const [tollMarkers, setTollMarkers] = useState([]);

  useEffect(() => {
    // Fetch route from TollGuru API and update state
    const fetchRoute = async () => {
      try {
        const response = await axios.get('TollGuru-API-Endpoint');
        const encodedPolyline = response.data.routeEncodedPolyline;
        const decodedRoute = decode(encodedPolyline);
        setRoute(decodedRoute);
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRoute();
  }, []); // Fetch route on component mount

  useEffect(() => {
    // Create Leaflet map and draw route
    const map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    if (route.length > 0) {
      const polyline = L.polyline(route, { color: 'blue' }).addTo(map);

      // Create toll markers along the route
      const markers = route.map((coord, index) => {
        const tollMarker = L.marker(coord).addTo(map);
        // Add tooltip with toll information
        tollMarker.bindTooltip(`Toll ${index + 1}`).openTooltip();
        return tollMarker;
      });

      setTollMarkers(markers);
    }
  }, [route]); // Redraw map when the route is updated

  return (
    <div>
      <div id="map" style={{ height: '500px' }}></div>
      {/* Display additional components for toll details and education on toll calculations */}
    </div>
  );
};

export default App;
