/**
 * KRUSHIDRISHTI AI — Footer Component
 * Developed by Sopan Pandit Gavali
 */

import React from 'react';
import { Sprout, ShieldAlert, Cpu, Heart, CheckCircle2 } from 'lucide-react';
import { Language } from '../types.js';
import { TRANSLATIONS } from '../i18n.js';

interface Props {
  lang: Language;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<Props> = ({ lang, onNavigate }) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm mt-auto">
      {/* Top Advisory Strip */}
      <div className="bg-emerald-950/40 border-b border-emerald-900/30 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm text-emerald-300 text-center">
          <ShieldAlert className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{t.disclaimer}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Platform Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-white font-extrabold text-lg tracking-wider font-['Outfit']">
                KRUSHI<span className="text-emerald-400">DRISHTI</span> AI
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              “Smart Vision for Healthier Crops”
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              KrushiDrishti AI is a scalable crop health diagnostics platform combining computer vision,
              leaf lesion localization, disease classification, and Explainable AI (Grad-CAM) with verified
              plant pathology protocols.
            </p>

            {/* Prominent Developer Attribution */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Developed by Sopan Pandit Gavali</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('scan')}
                  className="hover:text-emerald-400 transition-colors font-medium text-emerald-400"
                >
                  {t.nav.scan}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('history')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.history}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('knowledge')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.knowledge}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.about}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Technology & Specs */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Platform Specifications</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Model: KrushiDiseaseNet v1.0</span>
              </div>
              <div>Inference: Gemini 3.8 Flash Vision</div>
              <div>Resolution: Bounding Box & 8×8 CAM</div>
              <div>Taxonomy: 18+ Crops, 30+ Diseases</div>
              <div>Audit Logging: Real Relational Store</div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} KrushiDrishti AI. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Developed by <strong className="text-slate-200">Sopan Pandit Gavali</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
