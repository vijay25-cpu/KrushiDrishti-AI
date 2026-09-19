/**
 * KRUSHIDRISHTI AI — Home View
 * Developed by Sopan Pandit Gavali
 */

import React from 'react';
import { Scan, BookOpen, ShieldCheck, Sparkles, Cpu, Eye, CheckCircle2, ArrowRight, Activity } from 'lucide-react';
import { Language } from '../types.js';
import { TRANSLATIONS } from '../i18n.js';

interface Props {
  lang: Language;
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<Props> = ({ lang, onNavigate }) => {
  const t = TRANSLATIONS[lang];

  const cropPills = [
    { name: 'Tomato (टोमॅटो)', scientific: 'Solanum lycopersicum', tag: 'Early / Late Blight' },
    { name: 'Potato (बटाटा)', scientific: 'Solanum tuberosum', tag: 'Scab / Blight' },
    { name: 'Rice (भात / धान)', scientific: 'Oryza sativa', tag: 'Blast / Brown Spot' },
    { name: 'Wheat (गहू)', scientific: 'Triticum aestivum', tag: 'Rust / Powdery Mildew' },
    { name: 'Cotton (कापूस)', scientific: 'Gossypium hirsutum', tag: 'Bacterial Blight' },
    { name: 'Grape (द्राक्षे)', scientific: 'Vitis vinifera', tag: 'Downy / Black Rot' },
    { name: 'Chilli (मिरची)', scientific: 'Capsicum annuum', tag: 'Anthracnose' },
    { name: 'Onion (कांदा)', scientific: 'Allium cepa', tag: 'Purple Blotch' },
    { name: 'Corn (मक्का)', scientific: 'Zea mays', tag: 'Northern Leaf Blight' },
    { name: 'Apple (सफरचंद)', scientific: 'Malus domestica', tag: 'Apple Scab' },
    { name: 'Soybean (सोयाबीन)', scientific: 'Glycine max', tag: 'Rust / Cercospora' },
    { name: 'Sugarcane (ऊस)', scientific: 'Saccharum officinarum', tag: 'Red Rot' },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-10">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Top Developer Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>KRUSHIDRISHTI AI — Developed by Sopan Pandit Gavali</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-['Outfit'] leading-tight">
            {t.hero.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              id="hero-scan-cta"
              onClick={() => onNavigate('scan')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02]"
            >
              <Scan className="w-5 h-5" />
              <span>{t.hero.scanCta}</span>
            </button>

            <button
              type="button"
              id="hero-knowledge-cta"
              onClick={() => onNavigate('knowledge')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-base flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>{t.hero.exploreCta}</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            {t.hero.supportedCoverage}
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-800/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center justify-center mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-1.5 font-['Outfit']">
              Leaf Lesion Localization
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects exact leaf margins and highlights disease lesion bounding boxes with localized confidence scores.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-800/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/50 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-1.5 font-['Outfit']">
              Explainable AI (Grad-CAM)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent 8×8 visual attention heatmaps revealing the exact pathological pixels that guided the AI prediction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-800/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800/50 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-1.5 font-['Outfit']">
              Severity Quantification
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Precise surface area computation: Healthy (0–5%), Mild (5–20%), Moderate (20–50%), to Severe (50%+).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-800/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/50 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base mb-1.5 font-['Outfit']">
              Certified IPM Solutions
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verified integrated pest management: organic, biological, cultural, and chemical treatments with dosage & PHI.
            </p>
          </div>
        </div>
      </section>

      {/* Step-by-Step Diagnostic Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Diagnostic Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Outfit']">
              How KrushiDrishti AI Diagnoses Crops
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative p-5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">Image Capture</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Farmer captures a leaf photo via smartphone camera or uploads from gallery with automatic blur and exposure checks.
              </p>
            </div>

            <div className="relative p-5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">Plant Detection</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computer vision classifies the crop species and validates confidence against model threshold before diagnosing.
              </p>
            </div>

            <div className="relative p-5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">Pathology & CAM</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identifies pathogen type, computes lesion bounding boxes, area percent, and calculates Explainable AI heatmap.
              </p>
            </div>

            <div className="relative p-5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                4
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">Agronomic Action</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates actionable IPM solutions, PDF certificates, and routes uncertain cases for agronomist review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Crops Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
              Supported Agricultural Crops & Diagnostic Models
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Trained on extensive agronomical taxonomies with verified disease profiles
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('knowledge')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {cropPills.map((crop, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('knowledge')}
              className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-600/60 cursor-pointer transition-all hover:bg-slate-850"
            >
              <div className="font-semibold text-white text-sm truncate">{crop.name}</div>
              <div className="text-[11px] text-slate-400 italic truncate">{crop.scientific}</div>
              <div className="mt-2 text-[10px] inline-block px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                {crop.tag}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
