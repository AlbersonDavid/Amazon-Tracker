import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import { Ship, Anchor, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Cidades na rota com coordenadas aproximadas
const ROUTE_CITIES = [
  { name: 'Macapá', lat: 0.0356, lng: -51.0705, order: 1 },
  { name: 'Almeirim', lat: -1.5283, lng: -52.5817, order: 2 },
  { name: 'Monte Alegre', lat: -2.0075, lng: -54.0725, order: 3 },
  { name: 'Santarém', lat: -2.4306, lng: -54.7081, order: 4 },
  { name: 'Óbidos', lat: -1.9025, lng: -55.5175, order: 5 },
  { name: 'Parintins', lat: -2.6283, lng: -56.7358, order: 6 },
  { name: 'Itacoatiara', lat: -3.1428, lng: -58.4442, order: 7 },
];

// Criar ícone customizado para navios
const createVesselIcon = (course = 0) => {
  return L.divIcon({
    className: 'vessel-marker',
    html: `
      <div style="
        transform: rotate(${course}deg);
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#0ea5e9" stroke="#0f172a" stroke-width="2">
          <path d="M12 2L4 21l8-4 8 4L12 2z"/>
        </svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const cityIcon = L.divIcon({
  className: 'city-marker',
  html: `
    <div style="
      width: 12px;
      height: 12px;
      background: #f97316;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

function MapController({ vessels, selectedVessel }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedVessel) {
      map.flyTo([selectedVessel.latitude, selectedVessel.longitude], 10, {
        duration: 1.5
      });
    }
  }, [selectedVessel, map]);
  
  return null;
}

export default function RouteMap({ vessels = [], selectedVessel, onSelectVessel }) {
  const routeCoordinates = ROUTE_CITIES.map(city => [city.lat, city.lng]);
  const center = [-1.5, -54.5]; // Centro aproximado da rota
  
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
      <MapContainer
        center={center}
        zoom={6}
        className="w-full h-full"
        style={{ background: '#0f172a' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <MapController vessels={vessels} selectedVessel={selectedVessel} />
        
        {/* Linha da rota */}
        <Polyline
          positions={routeCoordinates}
          pathOptions={{
            color: '#0ea5e9',
            weight: 3,
            opacity: 0.6,
            dashArray: '10, 10'
          }}
        />
        
        {/* Marcadores das cidades */}
        {ROUTE_CITIES.map((city) => (
          <React.Fragment key={city.name}>
            <Marker position={[city.lat, city.lng]} icon={cityIcon}>
              <Popup className="custom-popup">
                <div className="font-semibold text-slate-800">{city.name}</div>
                <div className="text-xs text-slate-500">
                  {city.order === 1 ? 'Origem' : city.order === 7 ? 'Destino' : `Ponto ${city.order}`}
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[city.lat, city.lng]}
              radius={15000}
              pathOptions={{
                color: '#f97316',
                fillColor: '#f97316',
                fillOpacity: 0.1,
                weight: 1
              }}
            />
          </React.Fragment>
        ))}
        
        {/* Marcadores dos navios */}
        {vessels.map((vessel) => (
          vessel.latitude && vessel.longitude && (
            <Marker
              key={vessel.mmsi}
              position={[vessel.latitude, vessel.longitude]}
              icon={createVesselIcon(vessel.course || 270)}
              eventHandlers={{
                click: () => onSelectVessel?.(vessel)
              }}
            >
              <Popup>
                <div className="p-1">
                  <div className="font-bold text-slate-800">{vessel.name}</div>
                  <div className="text-xs text-slate-600 space-y-1 mt-1">
                    <div>MMSI: {vessel.mmsi}</div>
                    <div>Velocidade: {vessel.speed?.toFixed(1) || '—'} nós</div>
                    <div>Curso: {vessel.course?.toFixed(0) || '—'}°</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
      
      {/* Legenda */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 text-xs text-white">
        <div className="font-semibold mb-2">Legenda</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Cidade na rota</span>
        </div>
        <div className="flex items-center gap-2">
          <Navigation className="w-3 h-3 text-sky-400" />
          <span>Navio em trânsito</span>
        </div>
      </div>
    </div>
  );
}

export { ROUTE_CITIES };