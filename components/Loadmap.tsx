import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { LngLatLike } from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN!!;

const LoadMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState<number>(-70.9);
  const [lat, setLat] = useState<number>(42.35);
  const [zoom, setZoom] = useState<number>(9);

  useEffect(() => {
    if (map.current) return; // map already initialized

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  }, [map, lng, lat, zoom]);

  useEffect(() => {
    if (!map.current) return; // map not yet initialized

    map.current.on('move', () => {
      if (!map.current) return; // map not yet initialized

      setLng(Number(map.current.getCenter().lng.toFixed(4)));
      setLat(Number(map.current.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current.getZoom().toFixed(2)));
    });
  }, []);

  useEffect((): (() => void) | void => {
    if (!map.current) return; // map not yet initialized
  
    const marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.current);
  
    // Remove marker when unmounting component
    return () => marker.remove();
  }, [lng, lat, map]);

  return (
    <div>
      <div ref={mapContainer} style={{ height: '400px' }} />
      <div>
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
    </div>
  );
};

export default LoadMap;
