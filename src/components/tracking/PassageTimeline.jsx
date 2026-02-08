import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Gauge, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ROUTE_CITIES } from './RouteMap';

export default function PassageTimeline({ passages = [], vesselName }) {
  // Criar mapa de passagens por cidade
  const passageMap = {};
  passages.forEach(p => {
    passageMap[p.city_name] = p;
  });
  
  return (
    <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
      <h3 className="text-lg font-bold text-white mb-1">Histórico de Passagens</h3>
      {vesselName && (
        <p className="text-sm text-slate-400 mb-4">{vesselName}</p>
      )}
      
      <div className="relative">
        {/* Linha vertical de conexão */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-sky-500 via-slate-600 to-slate-700" />
        
        <div className="space-y-4">
          {ROUTE_CITIES.map((city, index) => {
            const passage = passageMap[city.name];
            const isPassed = !!passage;
            const isFirst = index === 0;
            const isLast = index === ROUTE_CITIES.length - 1;
            
            return (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Indicador */}
                <div className={`
                  relative z-10 w-6 h-6 rounded-full flex items-center justify-center
                  ${isPassed 
                    ? 'bg-sky-500 shadow-lg shadow-sky-500/30' 
                    : 'bg-slate-700 border-2 border-slate-600'
                  }
                `}>
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <Circle className="w-3 h-3 text-slate-500" />
                  )}
                </div>
                
                {/* Conteúdo */}
                <div className={`flex-1 pb-4 ${!isPassed && 'opacity-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold ${isPassed ? 'text-white' : 'text-slate-400'}`}>
                      {city.name}
                    </span>
                    {isFirst && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                        Origem
                      </span>
                    )}
                    {isLast && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                        Destino
                      </span>
                    )}
                  </div>
                  
                  {isPassed ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-slate-300">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {format(new Date(passage.passage_time), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                      </div>
                      {passage.speed_at_passage && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Gauge className="w-3 h-3" />
                          {passage.speed_at_passage.toFixed(1)} nós
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Aguardando passagem</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}