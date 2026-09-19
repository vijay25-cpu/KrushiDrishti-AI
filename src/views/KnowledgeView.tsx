/**
 * KRUSHIDRISHTI AI — Verified Agricultural Knowledge Directory
 * Developed by Sopan Pandit Gavali
 */

import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Sprout, ShieldAlert, ChevronRight, X, AlertTriangle, CheckCircle2, Droplets } from 'lucide-react';
import { Language, CropInfo, DiseaseInfo } from '../types.js';
import { TRANSLATIONS } from '../i18n.js';
import { api } from '../api.js';

interface Props {
  lang: Language;
  onScanWithCrop?: (cropName: string) => void;
}

export const KnowledgeView: React.FC<Props> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'crops' | 'diseases'>('crops');
  const [crops, setCrops] = useState<CropInfo[]>([]);
  const [diseases, setDiseases] = useState<DiseaseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<CropInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cRes, dRes] = await Promise.all([api.getCrops(), api.getDiseases()]);
        setCrops(cRes.crops || []);
        setDiseases(dRes.diseases || []);
      } catch (e) {
        console.error('Failed to load knowledge base:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCrops = crops.filter(
    (c) =>
      c.commonName.en.toLowerCase().includes(search.toLowerCase()) ||
      c.commonName.mr.toLowerCase().includes(search.toLowerCase()) ||
      c.commonName.hi.toLowerCase().includes(search.toLowerCase()) ||
      c.scientificName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDiseases = diseases.filter(
    (d) =>
      d.name.en.toLowerCase().includes(search.toLowerCase()) ||
      d.name.mr.toLowerCase().includes(search.toLowerCase()) ||
      d.name.hi.toLowerCase().includes(search.toLowerCase()) ||
      d.cropName.en.toLowerCase().includes(search.toLowerCase()) ||
      d.pathogenType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Verified Agricultural Taxonomy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
          {t.nav.knowledge}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Certified plant pathology catalog, symptoms, etiology, IPM controls, and chemical safety guidelines
        </p>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('crops');
              setSelectedDisease(null);
            }}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'crops'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Supported Crops ({crops.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('diseases');
              setSelectedCrop(null);
            }}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'diseases'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Disease Taxonomies ({diseases.length})</span>
          </button>
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab === 'crops' ? 'crops or scientific names...' : 'diseases or pathogens...'}`}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          Loading agricultural directory...
        </div>
      ) : activeTab === 'crops' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCrops.map((crop) => (
            <div
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-600/60 cursor-pointer transition-all hover:bg-slate-850 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-mono">
                    {crop.category}
                  </span>
                  <span className="text-[11px] text-slate-400">{crop.optimalSeason}</span>
                </div>

                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  {crop.commonName[lang] || crop.commonName.en}
                </h3>
                <p className="text-xs text-slate-400 italic mb-3">
                  {crop.scientificName} • Family: {crop.family}
                </p>

                <div className="text-xs text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300">Common Pathogens:</div>
                  <div className="flex flex-wrap gap-1">
                    {crop.commonDiseases.map((d, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>View Agronomic Profile</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDiseases.map((d) => (
            <div
              key={d.id}
              onClick={() => setSelectedDisease(d)}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-red-600/60 cursor-pointer transition-all hover:bg-slate-850 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/40 font-mono">
                    {d.pathogenType}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {d.cropName[lang] || d.cropName.en}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-['Outfit'] truncate">
                  {d.name[lang] || d.name.en}
                </h3>
                <p className="text-xs text-slate-400 italic mb-2 truncate">
                  {d.scientificName}
                </p>

                <p className="text-xs text-slate-300 line-clamp-2">
                  {d.symptoms[lang]?.[0] || d.symptoms.en?.[0] || 'Visible pathological foliar symptoms.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-red-400 font-semibold">
                <span>Read Disease & IPM Strategy</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disease Detail Modal */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-slate-200 shadow-2xl space-y-6 my-6">
            <button
              type="button"
              onClick={() => setSelectedDisease(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/40">
                  {selectedDisease.pathogenType}
                </span>
                <span className="text-xs text-slate-400">
                  Affects: <strong>{selectedDisease.cropName[lang] || selectedDisease.cropName.en}</strong>
                </span>
              </div>
              <h2 className="text-2xl font-black text-white font-['Outfit']">
                {selectedDisease.name[lang] || selectedDisease.name.en}
              </h2>
              <p className="text-xs text-slate-400 italic">
                Pathogen: {selectedDisease.scientificName}
              </p>
            </div>

            {/* Symptoms */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Key Symptoms
              </h4>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-300">
                {(selectedDisease.symptoms[lang] || selectedDisease.symptoms.en).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Causes & Favorable Conditions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Favorable Environmental Conditions
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                {selectedDisease.favorableConditions[lang] || selectedDisease.favorableConditions.en}
              </p>
            </div>

            {/* IPM Treatments */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Integrated Disease Management & Treatments
              </h4>
              <div className="space-y-2">
                {selectedDisease.treatments.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between font-bold text-white mb-1">
                      <span>{t.title[lang] || t.title.en}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {t.type}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-1">{t.description[lang] || t.description.en}</p>
                    {t.dosage && (
                      <div className="text-emerald-300 font-semibold">Dosage: {t.dosage}</div>
                    )}
                    {t.phiDays && (
                      <div className="text-amber-300">Pre-Harvest Interval (PHI): {t.phiDays} Days</div>
                    )}
                    {t.safetyPrecautions && (
                      <div className="text-red-300/90 text-[11px] mt-1">
                        Caution: {t.safetyPrecautions[lang] || t.safetyPrecautions.en}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Source & Attribution */}
            <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Source: {selectedDisease.source}</span>
              <span>Reviewed: {selectedDisease.lastReviewedDate}</span>
            </div>
          </div>
        </div>
      )}

      {/* Crop Detail Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 shadow-2xl space-y-4 my-6">
            <button
              type="button"
              onClick={() => setSelectedCrop(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                {selectedCrop.category}
              </span>
              <h2 className="text-2xl font-black text-white font-['Outfit'] mt-1">
                {selectedCrop.commonName[lang] || selectedCrop.commonName.en}
              </h2>
              <p className="text-xs text-slate-400 italic">
                {selectedCrop.scientificName} • Botanical Family: {selectedCrop.family}
              </p>
            </div>

            <div className="text-xs space-y-2">
              <div>
                <span className="text-slate-400 font-semibold">Optimal Season: </span>
                <span className="text-white">{selectedCrop.optimalSeason}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Supported Disease Profiles:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {selectedCrop.commonDiseases.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
