import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import geoJson from "../chicago-parks.json";

const c = 0;
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN!!;

const Map = () => {
  const mapContainerRef = useRef(null);
  const [zoom, setZoom] = useState(9);
  const [lng, setLng] = useState(-87.65);
  const [lt, setLt] = useState(41.84);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-87.65, 41.84],
      zoom: 10,
    });

    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        function (error: any, image: any) {
          if (error) throw error;
          map.addImage("custom-marker", image);

          // Add a GeoJSON source with multiple points
          map.addSource("points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: geoJson.map((point) => ({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [point.long, point.lat],
                },
                properties: {
                  title: `Point ${c+1}`,
                },
              })),
            },
          });

          // Add a GeoJSON source for the line
          map.addSource("line", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: geoJson.map((point) => [point.long, point.lat]),
              },
            },
          });

          // Add a symbol layer for the points
          map.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              // get the title name from the source's "title" property
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });

          // Add a line layer
          map.addLayer({
            id: "line",
            type: "line",
            source: "line",
            layout: {},
            paint: {
              "line-color": "blue",
              "line-width": 8,
            },
          });
        }
      );
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    if (!map) return; // wait for map to initialize

    map.on("move", () => {
      setLng(Number(map.getCenter().lng.toFixed(4)));
      setLt(Number(map.getCenter().lat.toFixed(4)));
      setZoom(Number(map.getZoom().toFixed(2)));
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lt} | Zoom: {zoom}
        </div>
      <div className="map-container" ref={mapContainerRef} />;
    </div>
  );
};

export default Map;