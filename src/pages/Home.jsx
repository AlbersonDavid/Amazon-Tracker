import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship, Settings, RefreshCw, Wifi, WifiOff, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import RouteMap from '@/components/tracking/RouteMap';
import VesselCard from '@/components/tracking/VesselCard';
import PassageTimeline from '@/components/tracking/PassageTimeline';
import ETACalculator from '@/components/tracking/ETACalculator';
import StatsBar from '@/components/tracking/StatsBar';
import APIConfigModal from '@/components/tracking/APIConfigModal';

// Dados de demonstração
const DEMO_VESSELS = [
  {
    id: 'demo-1',
    mmsi: '710001234',
    name: 'NAVIO AMAZONAS',
    ship_type: 'Cargo',
    flag: 'BR',
    latitude: -1.8,
    longitude: -55.0,
    speed: 8.5,
    course: 270,
    destination: 'ITACOATIARA',
    status: 'em_transito',
    eta_destination: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    last_position_update: new Date().toISOString()
  },
  {
    id: 'demo-2',
    mmsi: '710005678',
    name: 'BARCO SOLIMÕES',
    ship_type: 'Passenger',
    flag: 'BR',
    latitude: -2.3,
    longitude: -56.2,
    speed: 12.3,
    course: 265,
    destination: 'ITACOATIARA',
    status: 'em_transito',
    eta_destination: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    last_position_update: new Date().toISOString()
  },
  {
    id: 'demo-3',
    mmsi: '710009012',
    name: 'FERRY NEGRO',
    ship_type: 'Ferry',
    flag: 'BR',
    latitude: -0.5,
    longitude: -52.0,
    speed: 6.8,
    course: 260,
    destination: 'ITACOATIARA',
    status: 'em_transito',
    eta_destination: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    last_position_update: new Date().toISOString()
  }
];

const DEMO_PASSAGES = [
  { id: 'p1', vessel_mmsi: '710001234', vessel_name: 'NAVIO AMAZONAS', city_name: 'Macapá', city_order: 1, passage_time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), speed_at_passage: 8.2 },
  { id: 'p2', vessel_mmsi: '710001234', vessel_name: 'NAVIO AMAZONAS', city_name: 'Almeirim', city_order: 2, passage_time: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), speed_at_passage: 9.0 },
  { id: 'p3', vessel_mmsi: '710001234', vessel_name: 'NAVIO AMAZONAS', city_name: 'Monte Alegre', city_order: 3, passage_time: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(), speed_at_passage: 8.8 },
  { id: 'p4', vessel_mmsi: '710001234', vessel_name: 'NAVIO AMAZONAS', city_name: 'Santarém', city_order: 4, passage_time: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), speed_at_passage: 8.5 },
  { id: 'p5', vessel_mmsi: '710001234', vessel_name: 'NAVIO AMAZONAS', city_name: 'Óbidos', city_order: 5, passage_time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), speed_at_passage: 8.5 },
  { id: 'p6', vessel_mmsi: '710005678', vessel_name: 'BARCO SOLIMÕES', city_name: 'Macapá', city_order: 1, passage_time: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), speed_at_passage: 12.0 },
  { id: 'p7', vessel_mmsi: '710005678', vessel_name: 'BARCO SOLIMÕES', city_name: 'Almeirim', city_order: 2, passage_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), speed_at_passage: 11.8 },
  { id: 'p8', vessel_mmsi: '710005678', vessel_name: 'BARCO SOLIMÕES', city_name: 'Monte Alegre', city_order: 3, passage_time: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), speed_at_passage: 12.3 },
  { id: 'p9', vessel_mmsi: '710005678', vessel_name: 'BARCO SOLIMÕES', city_name: 'Santarém', city_order: 4, passage_time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), speed_at_passage: 12.0 },
  { id: 'p10', vessel_mmsi: '710005678', vessel_name: 'BARCO SOLIMÕES', city_name: 'Óbidos', city_order: 5, passage_time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), speed_at_passage: 12.1 },
  { id: 'p11', vessel_mmsi: '710005678', vessel_name: 'BARCO SOLIMÕES', city_name: 'Parintins', city_order: 6, passage_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), speed_at_passage: 12.3 },
  { id: 'p12', vessel_mmsi: '710009012', vessel_name: 'FERRY NEGRO', city_name: 'Macapá', city_order: 1, passage_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), speed_at_passage: 6.5 },
  { id: 'p13', vessel_mmsi: '710009012', vessel_name: 'FERRY NEGRO', city_name: 'Almeirim', city_order: 2, passage_time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), speed_at_passage: 6.8 },
];

export default function Home() {
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [useDemoData, setUseDemoData] = useState(true);
  const queryClient = useQueryClient();

  // Query para navios
  const { data: vessels = [], isLoading: vesselsLoading, refetch: refetchVessels } = useQuery({
    queryKey: ['vessels'],
    queryFn: () => base44.entities.Vessel.list('-last_position_update'),
    enabled: !useDemoData,
  });

  // Query para passagens
  const { data: passages = [], isLoading: passagesLoading } = useQuery({
    queryKey: ['passages'],
    queryFn: () => base44.entities.CityPassage.list('-passage_time'),
    enabled: !useDemoData,
  });

  // Usar dados de demo ou reais
  const displayVessels = useDemoData ? DEMO_VESSELS : vessels;
  const displayPassages = useDemoData ? DEMO_PASSAGES : passages;

  // Filtrar passagens do navio selecionado
  const selectedVesselPassages = selectedVessel
    ? displayPassages.filter(p => p.vessel_mmsi === selectedVessel.mmsi).sort((a, b) => a.city_order - b.city_order)
    : [];

  const lastPassage = selectedVesselPassages[selectedVesselPassages.length - 1];

  const handleRefresh = () => {
    if (!useDemoData) {
      refetchVessels();
    }
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (key) {
      setUseDemoData(false);
      setIsConnected(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AmazonTracker</h1>
                <p className="text-xs text-slate-400">Macapá → Itacoatiara</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Status de conexão */}
              <div className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                ${useDemoData 
                  ? 'bg-amber-500/20 text-amber-400' 
                  : isConnected 
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }
              `}>
                {useDemoData ? (
                  <>
                    <Info className="w-3 h-3" />
                    Modo Demo
                  </>
                ) : isConnected ? (
                  <>
                    <Wifi className="w-3 h-3" />
                    Conectado
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3" />
                    Desconectado
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsConfigOpen(true)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6">
        {/* Stats Bar */}
        <div className="mb-6">
          <StatsBar vessels={displayVessels} passages={displayPassages} />
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lista de Navios */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Ship className="w-5 h-5 text-sky-400" />
                  Navios na Rota
                  <span className="ml-auto text-sm font-normal text-slate-400">
                    {displayVessels.length}
                  </span>
                </h2>
              </div>
              <ScrollArea className="h-[calc(100vh-380px)]">
                <div className="p-3 space-y-3">
                  {displayVessels.map((vessel) => (
                    <VesselCard
                      key={vessel.mmsi}
                      vessel={vessel}
                      isSelected={selectedVessel?.mmsi === vessel.mmsi}
                      onClick={() => setSelectedVessel(
                        selectedVessel?.mmsi === vessel.mmsi ? null : vessel
                      )}
                      passages={displayPassages.filter(p => p.vessel_mmsi === vessel.mmsi)}
                    />
                  ))}
                  {displayVessels.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Ship className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhum navio encontrado</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          {/* Mapa */}
          <div className="lg:col-span-6 h-[calc(100vh-320px)] min-h-[400px]">
            <RouteMap
              vessels={displayVessels}
              selectedVessel={selectedVessel}
              onSelectVessel={setSelectedVessel}
            />
          </div>
          
          {/* Painel de Detalhes */}
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence mode="wait">
              {selectedVessel ? (
                <motion.div
                  key={selectedVessel.mmsi}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* ETA Calculator */}
                  <ETACalculator
                    vessel={selectedVessel}
                    lastPassage={lastPassage}
                  />
                  
                  {/* Timeline */}
                  <PassageTimeline
                    passages={selectedVesselPassages}
                    vesselName={selectedVessel.name}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-800/30 rounded-2xl p-8 text-center border border-dashed border-slate-700"
                >
                  <Ship className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-400 mb-2">
                    Selecione um Navio
                  </h3>
                  <p className="text-sm text-slate-500">
                    Clique em um navio na lista ou no mapa para ver detalhes e histórico de passagens
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Config Modal */}
      <APIConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleSaveApiKey}
        currentKey={apiKey}
      />
    </div>
  );
}