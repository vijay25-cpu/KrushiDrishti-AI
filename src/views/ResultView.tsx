/**
 * KRUSHIDRISHTI AI — Result & Diagnostic Dashboard View
 * Developed by Sopan Pandit Gavali
 */

import React, { useState } from 'react';
import { Sprout, ShieldAlert, CheckCircle2, AlertTriangle, Printer, RotateCcw, ThumbsUp, ThumbsDown, HelpCircle, Activity, Sparkles, Clock, Layers } from 'lucide-react';
import { Language, AnalysisRecordData } from '../types.js';
import { TRANSLATIONS } from '../i18n.js';
import { VisualOverlay } from '../components/VisualOverlay.js';
import { ReportModal } from '../components/ReportModal.js';
import { api } from '../api.js';

interface Props {
  record: AnalysisRecordData;
  lang: Language;
  onAnalyzeAnother: () => void;
  onRequestExpert: () => void;
}

export const ResultView: React.FC<Props> = ({
  record,
  lang,
  onAnalyzeAnother,
  onRequestExpert,
}) => {
  const t = TRANSLATIONS[lang];
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<'Correct' | 'Incorrect' | 'Not Sure' | null>(null);
  const [issueType, setIssueType] = useState<string>('None');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'Healthy':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'Mild':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'Moderate':
        return 'bg-orange-950 text-orange-300 border-orange-800';
      case 'Severe':
      case 'Very Severe':
        return 'bg-red-950 text-red-300 border-red-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getHealthBadgeClass = (status: string) => {
    if (status === 'Healthy') return 'bg-emerald-600 text-white';
    if (status === 'Diseased') return 'bg-red-600 text-white';
    return 'bg-amber-600 text-white';
  };

  const submitFeedback = async () => {
    if (!feedbackRating) return;
    setIsSubmittingFeedback(true);
    try {
      await api.submitFeedback({
        analysis_id: record.id,
        helpful_status: feedbackRating,
        issue_type: issueType,
        comment: feedbackComment,
      });
      setFeedbackSubmitted(true);
    } catch (e) {
      console.error('Feedback error:', e);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
              {t.result.header}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">
              Record #{record.id}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-1">
            {t.result.sectionTitle}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>{t.result.generateReport}</span>
          </button>

          <button
            type="button"
            onClick={onAnalyzeAnother}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.result.analyzeAnother}</span>
          </button>
        </div>
      </div>

      {/* Uncertainty Advisory Notice (Section 10) */}
      {record.disease_confidence < 70 && record.health_status === 'Diseased' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/60 border border-amber-800 text-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{t.scan.lowConfidenceNotice}</span>
          </div>
          <button
            type="button"
            onClick={onRequestExpert}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shrink-0"
          >
            {t.scan.requestExpert}
          </button>
        </div>
      )}

      {/* Key Diagnostic Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Plant Identity Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>{t.result.plant}</span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {record.plant_confidence}% Conf.
            </span>
          </div>

          <div>
            <h2 className="text-xl font-black text-white font-['Outfit']">
              {record.plant_name}
            </h2>
            <p className="text-xs text-slate-400 italic">
              {record.scientific_name || 'Botanical classification'}
            </p>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${record.plant_confidence}%` }}
            />
          </div>
        </div>

        {/* Pathology Diagnosis Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>{t.result.disease}</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-bold ${getHealthBadgeClass(
                record.health_status
              )}`}
            >
              {record.health_status}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-black text-white font-['Outfit'] truncate">
              {record.disease_name}
            </h2>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Confidence: <strong className="text-emerald-400 font-mono">{record.disease_confidence}%</strong></span>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                record.health_status === 'Healthy' ? 'bg-emerald-500' : 'bg-red-500'
              }`}
              style={{ width: `${record.disease_confidence}%` }}
            />
          </div>
        </div>

        {/* Severity & Affected Area Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>{t.result.severity}</span>
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getSeverityBadgeClass(
                record.severity
              )}`}
            >
              {record.severity}
            </span>
          </div>

          <div>
            <div className="text-xl font-black text-white font-['Outfit']">
              {record.affected_area_percent}% Affected
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Localized Lesions: {record.localization_boxes?.length || 0}
            </p>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full"
              style={{ width: `${Math.min(100, record.affected_area_percent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Visual Overlay (Original / Bounding Boxes / Grad-CAM Heatmap) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Interactive Visual Pathology Inspection</span>
          </h3>
          <span className="text-xs text-slate-400">
            Model: {record.model_name} {record.model_version}
          </span>
        </div>

        <VisualOverlay
          imageUrl={record.original_image}
          boxes={record.localization_boxes}
          attentionMatrix={record.attention_matrix}
          explainabilityText={record.explainability_text}
          severity={record.severity}
        />
      </section>

      {/* Symptoms & Etiology Causes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t.result.symptomsTitle}</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            {record.symptoms?.map((sym, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{sym}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>{t.result.causesTitle}</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            {record.causes?.map((cause, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Integrated Disease Management & Solutions (IPM) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white font-['Outfit']">
              {t.result.managementTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified integrated management protocols tailored to severity level
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-mono">
            IPM Protocols
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {record.solution?.map((sol, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  {sol.title}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {sol.type}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {sol.description}
              </p>
              {sol.dosage && (
                <div className="text-xs text-emerald-300 font-semibold pt-1">
                  Dosage: <span className="text-white">{sol.dosage}</span>
                </div>
              )}
              {sol.phiDays && (
                <div className="text-xs text-amber-300">
                  Pre-Harvest Interval (PHI): <strong>{sol.phiDays} Days</strong>
                </div>
              )}
              {sol.safetyPrecautions && (
                <div className="text-[11px] text-red-300/90 pt-1 border-t border-slate-800/80">
                  ⚠️ <strong>Caution:</strong> {sol.safetyPrecautions}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Prevention */}
        {record.prevention && record.prevention.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2 font-['Outfit']">
              {t.result.preventionTitle}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {record.prevention.map((prev, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{prev}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Expert Review Stamp (if reviewed) */}
      {record.expert_review && (
        <div className="p-5 rounded-2xl bg-teal-950/40 border border-teal-800/80 text-teal-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
            <span>Certified Agronomist Verification Stamp</span>
          </div>
          <div>
            Verified by: <strong>{record.expert_review.expert_name}</strong> on {new Date(record.expert_review.reviewed_at).toLocaleString()}
          </div>
          <p className="italic text-teal-100 bg-slate-950/40 p-3 rounded-lg border border-teal-900/60">
            “{record.expert_review.expert_comment}”
          </p>
        </div>
      )}

      {/* Feedback Section (Prompt Section 36) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="font-bold text-white font-['Outfit'] text-base">
            {t.result.wasHelpful}
          </span>
          {feedbackSubmitted && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.result.feedbackSubmitted}</span>
            </span>
          )}
        </div>

        {!feedbackSubmitted && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFeedbackRating('Correct')}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  feedbackRating === 'Correct'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{t.result.correct}</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedbackRating('Incorrect')}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  feedbackRating === 'Incorrect'
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>{t.result.incorrect}</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedbackRating('Not Sure')}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  feedbackRating === 'Not Sure'
                    ? 'bg-amber-600 border-amber-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t.result.notSure}</span>
              </button>
            </div>

            {feedbackRating === 'Incorrect' && (
              <div className="space-y-2 pt-2">
                <div className="text-xs text-slate-400 font-semibold">
                  {t.result.reportIssue}
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Wrong Plant', 'Wrong Disease', 'Wrong Severity', 'Other'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setIssueType(type)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                        issueType === type
                          ? 'bg-red-950 border-red-700 text-red-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Provide agronomical notes to help improve model accuracy..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {feedbackRating && (
              <button
                type="button"
                onClick={submitFeedback}
                disabled={isSubmittingFeedback}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isSubmittingFeedback ? 'Submitting...' : t.result.submitFeedback}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Printable Report Modal */}
      <ReportModal
        record={record}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
};
