/**
 * KRUSHIDRISHTI AI — Agriculture Expert Review Portal
 * Developed by Sopan Pandit Gavali
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, UserCheck, MessageSquare, Send, Eye, RefreshCw } from 'lucide-react';
import { Language, AnalysisRecordData, UserProfile } from '../types.js';
import { TRANSLATIONS } from '../i18n.js';
import { api } from '../api.js';

interface Props {
  lang: Language;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onInspectRecord: (record: AnalysisRecordData) => void;
}

export const ExpertView: React.FC<Props> = ({
  lang,
  user,
  onOpenAuth,
  onInspectRecord,
}) => {
  const t = TRANSLATIONS[lang];
  const [cases, setCases] = useState<AnalysisRecordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<AnalysisRecordData | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [correctedPlant, setCorrectedPlant] = useState('');
  const [correctedDisease, setCorrectedDisease] = useState('');
  const [correctedSeverity, setCorrectedSeverity] = useState<'Healthy' | 'Mild' | 'Moderate' | 'Severe' | 'Very Severe' | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isExpert = user?.role === 'expert' || user?.role === 'admin';

  const fetchCases = async () => {
    if (!isExpert) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.getExpertCases();
      setCases(res.cases || []);
    } catch (e) {
      console.error('Error fetching expert cases:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [user]);

  const handleSelectCase = (c: AnalysisRecordData) => {
    setSelectedCase(c);
    setReviewComment(c.expert_review?.expert_comment || '');
    setCorrectedPlant(c.expert_review?.corrected_plant || c.plant_name);
    setCorrectedDisease(c.expert_review?.corrected_disease || c.disease_name);
    setCorrectedSeverity(
      (c.expert_review?.corrected_severity as any) || c.severity
    );
    setSuccessMessage(null);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !reviewComment) return;

    setSubmitting(true);
    try {
      const res = await api.submitExpertReview({
        analysis_id: selectedCase.id,
        comment: reviewComment,
        corrected_plant: correctedPlant !== selectedCase.plant_name ? correctedPlant : undefined,
        corrected_disease: correctedDisease !== selectedCase.disease_name ? correctedDisease : undefined,
        corrected_severity: correctedSeverity !== selectedCase.severity ? (correctedSeverity as any) : undefined,
      });

      setSuccessMessage('Expert verification recorded successfully!');
      // Update local cases list
      setCases((prev) =>
        prev.map((item) => (item.id === selectedCase.id ? res.analysis : item))
      );
      setSelectedCase(res.analysis);
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isExpert) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-teal-950/80 text-teal-400 border border-teal-800/60 mx-auto flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">
            Agriculture Expert Verification Portal
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            This module is reserved for certified agronomists and plant pathologists to review flagged cases and calibrate model diagnoses.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 max-w-md mx-auto">
          <div className="text-xs font-semibold text-slate-300">
            Sign in with the pre-seeded expert account to access this workspace:
          </div>
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-md"
          >
            Sign In as Agriculture Expert
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Pathologist & Agronomist Workbench</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            {t.nav.expert}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Logged in as: <strong className="text-slate-200">{user.full_name}</strong> ({user.organization || 'Research Council'})
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCases}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Queue List */}
        <div className="space-y-3 lg:col-span-1">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            <span>Review Queue</span>
            <span>{cases.length} Scans</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading queue...</div>
          ) : cases.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
              No flagged or pending cases currently in queue. All diagnoses meet high confidence thresholds.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {cases.map((c) => {
                const isSelected = selectedCase?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCase(c)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-950/60 border-teal-500 shadow-sm'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={c.original_image}
                        alt="Leaf"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-800 shrink-0"
                      />
                      <div className="overflow-hidden space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs truncate">
                            {c.plant_name}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">
                            {c.disease_confidence}%
                          </span>
                        </div>
                        <div className="text-xs text-red-400 truncate">
                          {c.disease_name}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>Status: <strong className="capitalize text-slate-300">{c.expert_status}</strong></span>
                          <span>{new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Inspection & Verification Form */}
        <div className="lg:col-span-2">
          {selectedCase ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Case #{selectedCase.id}
                  </span>
                  <h3 className="text-lg font-bold text-white font-['Outfit'] mt-0.5">
                    Field Specimen Inspection
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => onInspectRecord(selectedCase)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full Dashboard View</span>
                </button>
              </div>

              {/* Specimen and AI Model Output */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={selectedCase.original_image}
                    alt="Inspection Leaf"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2 text-xs bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-1">
                    AI Model Diagnosis
                  </div>
                  <div>
                    Plant: <strong className="text-white">{selectedCase.plant_name}</strong> ({selectedCase.plant_confidence}%)
                  </div>
                  <div>
                    Disease: <strong className="text-red-400">{selectedCase.disease_name}</strong> ({selectedCase.disease_confidence}%)
                  </div>
                  <div>
                    Severity: <strong className="text-amber-400">{selectedCase.severity}</strong> ({selectedCase.affected_area_percent}% affected)
                  </div>
                  <div className="text-slate-400 italic pt-1 border-t border-slate-800">
                    "{selectedCase.explainability_text}"
                  </div>
                </div>
              </div>

              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Verification Form */}
              <form onSubmit={handleSubmitReview} className="space-y-4 pt-2 border-t border-slate-800">
                <div className="font-bold text-white text-sm font-['Outfit'] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal-400" />
                  <span>Certified Agronomist Evaluation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Crop / Plant Species
                    </label>
                    <input
                      type="text"
                      value={correctedPlant}
                      onChange={(e) => setCorrectedPlant(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Disease Identification
                    </label>
                    <input
                      type="text"
                      value={correctedDisease}
                      onChange={(e) => setCorrectedDisease(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Severity Rating
                    </label>
                    <select
                      value={correctedSeverity}
                      onChange={(e: any) => setCorrectedSeverity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="Healthy">Healthy</option>
                      <option value="Mild">Mild</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Severe">Severe</option>
                      <option value="Very Severe">Very Severe</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pathologist Agronomic Comments & Prescription
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Enter agronomist observations, verification confirmation, or recommended fungicide/cultural adjustments..."
                    className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting Verification...' : 'Submit Expert Verification'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex items-center justify-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
              Select a scan from the left queue to begin pathologist review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
