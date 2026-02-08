import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, AlertTriangle, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function APIConfigModal({ isOpen, onClose, onSave, currentKey }) {
  const [apiKey, setApiKey] = useState(currentKey || '');
  
  const handleSave = () => {
    onSave(apiKey);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/20">
                <Key className="w-5 h-5 text-sky-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Configurar API</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm text-amber-400 font-medium mb-1">API Key Necessária</p>
                <p className="text-xs text-slate-400">
                  Para receber dados em tempo real, você precisa de uma chave da API do MarineTraffic.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="apiKey" className="text-slate-300 text-sm">
                MarineTraffic API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Insira sua API key..."
                className="mt-1 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            
            <a
              href="https://www.marinetraffic.com/en/ais-api-services"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Obter API Key no MarineTraffic
            </a>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!apiKey}
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}