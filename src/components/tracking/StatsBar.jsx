import React from 'react';
import { motion } from 'framer-motion';
import { Ship, Navigation, Clock, MapPin } from 'lucide-react';

export default function StatsBar({ vessels = [], passages = [] }) {
  const activeVessels = vessels.filter(v => v.status === 'em_transito').length;
  const arrivedVessels = vessels.filter(v => v.status === 'chegou').length;
  const totalPassages = passages.length;
  const avgSpeed = vessels.length > 0 
    ? vessels.reduce((acc, v) => acc + (v.speed || 0), 0) / vessels.length 
    : 0;
  
  const stats = [
    { 
      label: 'Navios em Trânsito', 
      value: activeVessels, 
      icon: Ship, 
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/20'
    },
    { 
      label: 'Velocidade Média', 
      value: `${avgSpeed.toFixed(1)} nós`, 
      icon: Navigation, 
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20'
    },
    { 
      label: 'Chegadas Hoje', 
      value: arrivedVessels, 
      icon: MapPin, 
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    { 
      label: 'Passagens Registradas', 
      value: totalPassages, 
      icon: Clock, 
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
  ];
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}