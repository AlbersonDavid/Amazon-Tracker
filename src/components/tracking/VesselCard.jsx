import React from 'react';
import { motion } from 'framer-motion';
import { Ship, Navigation, Clock, Gauge, MapPin, Flag, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  em_transito: { label: 'Em Trânsito', color: 'bg-sky-500', textColor: 'text-sky-500' },
  atracado: { label: 'Atracado', color: 'bg-amber-500', textColor: 'text-amber-500' },
  fundeado: { label: 'Fundeado', color: 'bg-orange-500', textColor: 'text-orange-500' },
  chegou: { label: 'Chegou', color: 'bg-emerald-500', textColor: 'text-emerald-500' },
};

export default function VesselCard({ vessel, isSelected, onClick, passages = [] }) {
  const status = statusConfig[vessel.status] || statusConfig.em_transito;
  const lastPassage = passages[passages.length - 1];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative p-4 rounded-2xl cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'bg-gradient-to-br from-sky-500/20 to-slate-800 border-2 border-sky-500/50 shadow-lg shadow-sky-500/10' 
          : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600'
        }
      `}
    >
      {/* Status indicator */}
      <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${status.color} animate-pulse`} />
      
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-xl ${isSelected ? 'bg-sky-500/20' : 'bg-slate-700/50'}`}>
          <Ship className={`w-5 h-5 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate">{vessel.name}</h3>
          <p className="text-xs text-slate-400">MMSI: {vessel.mmsi}</p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-2 text-xs">
          <Gauge className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-300">
            <span className="font-semibold text-white">{vessel.speed?.toFixed(1) || '—'}</span> nós
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Navigation className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-300">
            <span className="font-semibold text-white">{vessel.course?.toFixed(0) || '—'}</span>°
          </span>
        </div>
      </div>
      
      {/* Last passage */}
      {lastPassage && (
        <div className="flex items-center gap-2 text-xs bg-slate-900/50 rounded-lg p-2 mb-3">
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-slate-400">Passou por</span>
          <span className="text-white font-medium">{lastPassage.city_name}</span>
        </div>
      )}
      
      {/* ETA */}
      {vessel.eta_destination && (
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>ETA Itacoatiara</span>
          </div>
          <span className="text-sm font-semibold text-emerald-400">
            {format(new Date(vessel.eta_destination), "dd/MM HH:mm", { locale: ptBR })}
          </span>
        </div>
      )}
      
      {/* Status badge */}
      <div className="mt-3 flex justify-end">
        <Badge variant="outline" className={`${status.textColor} border-current text-xs`}>
          {status.label}
        </Badge>
      </div>
    </motion.div>
  );
}