/**
 * KRUSHIDRISHTI AI — About Page & System Documentation
 * Developed by Sopan Pandit Gavali
 */

import React from 'react';
import { Sprout, CheckCircle2, ShieldAlert, Cpu, Heart, Award, Layers, Users, Globe } from 'lucide-react';
import { Language } from '../types.js';
import { TRANSLATIONS } from '../i18n.js';

interface Props {
  lang: Language;
}

export const AboutView: React.FC<Props> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      {/* Header */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold">
          <Sprout className="w-4 h-4 text-emerald-400" />
          <span>Agricultural Computer Vision Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">
          KRUSHIDRISHTI AI
        </h1>
        <p className="text-lg sm:text-xl text-emerald-400 font-semibold">
          “Smart Vision for Healthier Crops”
        </p>
      </div>

      {/* Prominent Developer Attribution Box (Sections 54 & 55) */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border-2 border-emerald-700/60 shadow-xl space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-lg shrink-0">
          <Award className="w-10 h-10" />
        </div>
        <div className="space-y-1 flex-1">
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Lead Architectural Creator & Engineer
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            Developed by Sopan Pandit Gavali
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
            Engineered as a scalable crop health diagnostics platform combining computer vision,
            multimodal pathology inference, lesion bounding localization, and transparent Explainable AI (Grad-CAM)
            for farmers and agronomists.
          </p>
        </div>
      </div>

      {/* Mission & Real Vision Directives */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Real AI Inference Principle</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            KrushiDrishti AI operates on genuine visual inference. It strictly avoids hardcoded predictions,
            synthetic mock delays, or fake results. If image quality is insufficient or a plant is not recognized,
            it honestly informs the user with practical field capture guidance.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-400" />
            <span>Explainable AI (Grad-CAM)</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Machine learning shouldn't be a black box. Our attention heatmaps show farmers and pathologists
            exactly which necrotic rings, chlorotic halos, or leaf margins triggered the model's classification.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>Multilingual for Indian Farmers</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Full native language support across English, Marathi (मराठी), and Hindi (हिंदी) so agricultural producers
            can read symptoms, etiology, and chemical safety cautions in their mother tongue.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Human-in-the-Loop Expert Reviews</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Borderline and low-confidence scans are automatically routed to certified agronomists and plant pathologists
            for professional inspection, correction, and feedback calibration.
          </p>
        </div>
      </div>

      {/* Official Agriculture Disclaimer */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Agricultural Diagnostic Notice & Disclaimer</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {t.disclaimer}
        </p>
        <p className="text-[11px] text-slate-500 pt-1">
          Always wear personal protective equipment (PPE) when applying chemical fungicides, and observe the prescribed Pre-Harvest Intervals (PHI) to protect consumer safety and soil health.
        </p>
      </div>
    </div>
  );
};
