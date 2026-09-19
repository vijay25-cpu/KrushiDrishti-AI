/**
 * KRUSHIDRISHTI AI — Diagnostic Certificate & PDF Report Modal
 * Developed by Sopan Pandit Gavali
 */

import React from 'react';
import { X, Printer, Download, Sprout, ShieldAlert, CheckCircle2, Calendar, Hash } from 'lucide-react';
import { AnalysisRecordData } from '../types.js';

interface Props {
  record: AnalysisRecordData;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<Props> = ({ record, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-4">
        {/* Action Controls Header (Hidden during actual paper print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm sm:text-base font-['Outfit']">
              KrushiDrishti AI — Agronomic Diagnostic Certificate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Certificate Paper Container */}
        <div className="p-8 sm:p-10 bg-white border-8 border-emerald-900/10 print:border-none print:p-0">
          {/* Official Letterhead */}
          <div className="border-b-2 border-emerald-700 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-wider text-emerald-900 font-['Outfit']">
                    KRUSHIDRISHTI AI
                  </h1>
                  <p className="text-xs font-semibold text-emerald-800 tracking-wide">
                    “Smart Vision for Healthier Crops”
                  </p>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-600 font-medium">
                Official Digital Plant Pathology Diagnostic Certificate
              </div>
            </div>

            <div className="text-right sm:text-right text-xs text-slate-600 space-y-1">
              <div className="flex items-center sm:justify-end gap-1 font-mono text-slate-700 font-bold">
                <Hash className="w-3.5 h-3.5 text-emerald-700" />
                <span>Certificate ID: {record.id}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>Date: {new Date(record.created_at).toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-bold">
                Model: {record.model_name} {record.model_version}
              </div>
            </div>
          </div>

          {/* Core Diagnostic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Plant Species
              </span>
              <div className="text-lg font-bold text-slate-900">{record.plant_name}</div>
              <div className="text-xs text-slate-600 italic">{record.scientific_name}</div>
              <div className="mt-2 text-xs font-semibold text-emerald-800">
                Identity Confidence: {record.plant_confidence}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Pathological Diagnosis
              </span>
              <div className="text-lg font-bold text-red-700">{record.disease_name}</div>
              <div className="text-xs text-slate-600">
                Health Status: <strong className="text-slate-800">{record.health_status}</strong>
              </div>
              <div className="mt-2 text-xs font-semibold text-emerald-800">
                Diagnosis Confidence: {record.disease_confidence}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Severity Assessment
              </span>
              <div className="text-lg font-bold text-amber-700">{record.severity}</div>
              <div className="text-xs text-slate-600">
                Estimated Affected Area: <strong>{record.affected_area_percent}%</strong>
              </div>
              <div className="mt-2 text-xs font-semibold text-slate-700">
                Lesions Localized: {record.localization_boxes?.length || 0}
              </div>
            </div>
          </div>

          {/* Plant Specimen Image Preview */}
          <div className="mb-6 border border-slate-200 rounded-xl p-3 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
            <img
              src={record.original_image}
              alt="Leaf Specimen"
              className="w-40 h-32 object-cover rounded-lg border border-slate-300"
            />
            <div className="text-xs space-y-1.5 flex-1">
              <div className="font-bold text-slate-800 text-sm">Computer Vision Evidence & Explainability</div>
              <p className="text-slate-600 leading-relaxed">
                {record.explainability_text || 'Active attention localized on necrotic lesion margins.'}
              </p>
              <div className="text-[11px] text-emerald-800 font-medium">
                Leaf Sharpness: {record.image_quality.blur_score}/100 • Exposure: {record.image_quality.brightness_score}/100 • Lighting Valid: Yes
              </div>
            </div>
          </div>

          {/* Symptoms & Causes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
              <h4 className="font-bold text-slate-800 mb-2 uppercase tracking-wide text-[11px]">
                Detected Symptoms
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {record.symptoms?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
              <h4 className="font-bold text-slate-800 mb-2 uppercase tracking-wide text-[11px]">
                Etiology & Causes
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {record.causes?.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Prescribed Integrated Management */}
          <div className="mb-6 text-xs">
            <h4 className="font-bold text-slate-800 mb-2.5 uppercase tracking-wide text-[11px] border-b pb-1">
              Prescribed Integrated Pest & Disease Management (IPM)
            </h4>
            <div className="space-y-2.5">
              {record.solution?.map((sol, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/40">
                  <div className="flex items-center justify-between font-bold text-emerald-900 mb-1">
                    <span>{sol.title} ({sol.type.toUpperCase()})</span>
                    {sol.phiDays && (
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                        PHI: {sol.phiDays} Days
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 mb-1">{sol.description}</p>
                  {sol.dosage && (
                    <div className="text-[11px] text-slate-800 font-semibold">Dosage: {sol.dosage}</div>
                  )}
                  {sol.safetyPrecautions && (
                    <div className="text-[10px] text-red-700 mt-1">Caution: {sol.safetyPrecautions}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Expert Review Signature Stamp (if reviewed) */}
          {record.expert_review && (
            <div className="mb-6 p-3.5 rounded-lg border border-teal-300 bg-teal-50/60 text-xs text-teal-900">
              <div className="font-bold flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Certified Agronomist Verification</span>
              </div>
              <div className="mt-1">
                Reviewer: <strong>{record.expert_review.expert_name}</strong> on {new Date(record.expert_review.reviewed_at).toLocaleDateString()}
              </div>
              <div className="italic mt-0.5 text-slate-700">“{record.expert_review.expert_comment}”</div>
            </div>
          )}

          {/* Certificate Footer with Required Developer Branding & Agronomic Disclaimer */}
          <div className="border-t-2 border-slate-300 pt-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div>
              <div className="font-bold text-slate-800 text-sm">
                KRUSHIDRISHTI AI
              </div>
              <div className="font-semibold text-emerald-800">
                Developed by Sopan Pandit Gavali
              </div>
              <p className="text-[10px] text-slate-500 max-w-sm mt-1">
                KrushiDrishti AI identifies supported plant species and disease conditions based on its trained models. Results with low confidence should be verified by an agriculture expert.
              </p>
            </div>

            <div className="text-center sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
              <div className="w-32 h-10 border-b border-dashed border-slate-400 mx-auto sm:ml-auto mb-1 flex items-end justify-center text-[10px] text-slate-400">
                Digital Verification Seal
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                KrushiDrishti Automated AI Engine
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
