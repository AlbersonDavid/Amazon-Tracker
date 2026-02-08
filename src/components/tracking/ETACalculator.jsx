import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Navigation, ArrowRight, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ROUTE_CITIES } from './RouteMap';

// Distância aproximada em milhas náuticas entre cidades consecutivas
const DISTANCES_NM = {
  'Macapá-Almeirim': 150,
  'Almeirim-Monte Alegre': 96,
  'Monte Alegre-Santarém': 60,
  'Santarém-Óbidos': 65,
  'Óbidos-Parintins': 90,
  'Parintins-Itacoatiara': 140,
};

// Calcular distância total até Itacoatiara
function calculateRemainingDistance(currentCity) {
  const cityIndex = ROUTE_CITIES.findIndex(c => c.name === currentCity);
  if (cityIndex === -1) return null;
  
  let totalDistance = 0;
  for (let i = cityIndex; i < ROUTE_CITIES.length - 1; i++) {
    const key = `${ROUTE_CITIES[i].name}-${ROUTE_CITIES[i + 1].name}`;
    totalDistance += DISTANCES_NM[key] || 80;
  }
  return totalDistance;
}

// Calcular ETA baseado na velocidade atual (milhas náuticas e nós)
function calculateETA(distanceNm, speedKnots) {
  if (!speedKnots || speedKnots <= 0) return null;
  // Velocidade em nós = milhas náuticas por hora
  const hoursRemaining = distanceNm / speedKnots;
  const eta = new Date();
  eta.setHours(eta.getHours() + hoursRemaining);
  return eta;
}

export default function ETACalculator({ vessel, lastPassage }) {
  if (!vessel) return null;
  
  const currentCity = lastPassage?.city_name || 'Macapá';
  const remainingDistance = calculateRemainingDistance(currentCity);
  const eta = calculateETA(remainingDistance, vessel.speed);
  
  // Progresso na rota
  const currentCityIndex = ROUTE_CITIES.findIndex(c => c.name === currentCity);
  const progress = ((currentCityIndex + 1) / ROUTE_CITIES.length) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-sky-400" />
        <h3 className="text-lg font-bold text-white">Estimativa de Chegada</h3>
      </div>
      
      {/* Barra de progresso */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Macapá</span>
          <span>Itacoatiara</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1 text-center">
          {progress.toFixed(0)}% do trajeto
        </p>
      </div>
      
      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-900/50 rounded-xl p-3">
          <p className="text-xs text-slate-500 mb-1">Última cidade</p>
          <p className="text-sm font-semibold text-white">{currentCity}</p>
        </div>
        <div className="bg-slate-900/50 rounded-xl p-3">
          <p className="text-xs text-slate-500 mb-1">Distância restante</p>
          <p className="text-sm font-semibold text-white">
            {remainingDistance ? `~${remainingDistance} mn` : '—'}
          </p>
        </div>
      </div>
      
      {/* ETA principal */}
      {eta ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
          <p className="text-xs text-emerald-400 mb-1">Chegada estimada em Itacoatiara</p>
          <p className="text-2xl font-bold text-white mb-1">
            {format(eta, "dd/MM 'às' HH:mm", { locale: ptBR })}
          </p>
          <p className="text-sm text-emerald-400">
            {formatDistanceToNow(eta, { locale: ptBR, addSuffix: true })}
          </p>
        </div>
      ) : (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-sm text-amber-400 font-medium">Velocidade indisponível</p>
            <p className="text-xs text-slate-400">Não é possível calcular ETA sem velocidade atual</p>
          </div>
        </div>
      )}
      
      {/* Velocidade atual */}
      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <Navigation className="w-4 h-4" />
          <span>Velocidade atual:</span>
        </div>
        <span className="font-bold text-sky-400">
          {vessel.speed?.toFixed(1) || '—'} nós
        </span>
      </div>
    </motion.div>
  );
}