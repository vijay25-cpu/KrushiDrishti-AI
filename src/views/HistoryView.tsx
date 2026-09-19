/**
 * KRUSHIDRISHTI AI — History View
 * Developed by Sopan Pandit Gavali
 */

import React, { useState, useEffect } from 'react';
import { History, Search, Trash2, ExternalLink, Calendar, Sprout, AlertCircle, ShieldAlert } from 'lucide-react';
import { Language, AnalysisRecordData } from '../types.js';
import { TRANSLATIONS } from '../i18n.js';
import { api } from '../api.js';

interface Props {
  lang: Language;
  onSelectRecord: (record: AnalysisRecordData) => void;
  onNewScan: () => void;
}

export const HistoryView: React.FC<Props> = ({ lang, onSelectRecord, onNewScan }) => {
  const t = TRANSLATIONS[lang];
  const [history, setHistory] = useState<AnalysisRecordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHealth, setFilterHealth] = useState<'All' | 'Healthy' | 'Diseased' | 'Unknown'>('All');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getHistory();
      setHistory(res.history || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this analysis record?')) return;
    try {
      await api.deleteAnalysis(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.plant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.disease_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesHealth =
      filterHealth === 'All' || item.health_status === filterHealth;

    return matchesSearch && matchesHealth;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            {t.nav.history}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Diagnostic records preserved in the KrushiDrishti relational store
          </p>
        </div>

        <button
          type="button"
          onClick={onNewScan}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Sprout className="w-4 h-4" />
          <span>New Plant Scan</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop, disease, or record ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          {(['All', 'Healthy', 'Diseased', 'Unknown'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterHealth(status)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterHealth === status
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* History Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Loading diagnostic history...
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400 space-y-3">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-base font-semibold text-white">No diagnostic records found</div>
          <p className="text-xs max-w-sm mx-auto">
            {searchTerm || filterHealth !== 'All'
              ? 'No matching scan results found for the selected filters.'
              : 'You have not scanned any plants yet. Capture a leaf image to start.'}
          </p>
          <button
            type="button"
            onClick={onNewScan}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <span>Start First Scan</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectRecord(item)}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-600/60 cursor-pointer transition-all hover:bg-slate-850 flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800">
                  <img
                    src={item.original_image}
                    alt={item.plant_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div
                    className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      item.health_status === 'Healthy'
                        ? 'bg-emerald-600 text-white'
                        : item.health_status === 'Diseased'
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {item.health_status}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors truncate">
                      {item.plant_name}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {item.plant_confidence}%
                    </span>
                  </div>

                  <div className="text-xs text-red-400 font-semibold truncate">
                    {item.disease_name}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <span>Severity: <strong className="text-slate-200">{item.severity}</strong></span>
                    <span>•</span>
                    <span>Area: <strong className="text-slate-200">{item.affected_area_percent}%</strong></span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-3 mt-4 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
