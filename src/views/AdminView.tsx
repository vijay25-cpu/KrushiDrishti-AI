/**
 * KRUSHIDRISHTI AI — Administrator Management Console
 * Developed by Sopan Pandit Gavali
 */

import React, { useState, useEffect } from 'react';
import { Settings, Users, Activity, Sliders, Shield, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Language, UserProfile } from '../types.js';
import { api } from '../api.js';

interface Props {
  lang: Language;
  user: UserProfile | null;
  onOpenAuth: () => void;
}

export const AdminView: React.FC<Props> = ({ user, onOpenAuth }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [plantThreshold, setPlantThreshold] = useState(65);
  const [diseaseThreshold, setDiseaseThreshold] = useState(70);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isAdmin = user?.role === 'admin';

  const loadAdminData = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [anaRes, usrRes, modRes, audRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminUsers(),
        api.getAdminModels(),
        api.getAdminAuditLogs(),
      ]);
      setAnalytics(anaRes.analytics);
      setUsersList(usrRes.users || []);
      setModels(modRes.models || []);
      setAuditLogs(audRes.logs || []);

      if (modRes.models?.[0]) {
        setPlantThreshold(modRes.models[0].plant_confidence_threshold || 65);
        setDiseaseThreshold(modRes.models[0].disease_confidence_threshold || 70);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const handleSaveThresholds = async (modelId: string) => {
    try {
      await api.updateModelThresholds(modelId, plantThreshold, diseaseThreshold);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update thresholds');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 mx-auto flex items-center justify-center shadow-lg">
          <Settings className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">
            Administrator Console Access
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Please sign in with administrator credentials to manage machine learning models, confidence thresholds, and system audit logs.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 max-w-md mx-auto">
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-md"
          >
            Sign In as Administrator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Core Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Platform Operations & Model Management
          </h1>
        </div>

        <button
          type="button"
          onClick={loadAdminData}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Analytics KPI Counters */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Inferences
            </span>
            <div className="text-2xl font-black text-white font-['Outfit']">
              {analytics.totalAnalyses}
            </div>
            <div className="text-[11px] text-emerald-400">
              Avg. Confidence: {analytics.avgConfidence}%
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Diseased vs Healthy
            </span>
            <div className="text-2xl font-black text-red-400 font-['Outfit']">
              {analytics.diseasedCount} <span className="text-emerald-400 text-lg font-normal">/ {analytics.healthyCount}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Unknown: {analytics.unknownCount}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Registered Users
            </span>
            <div className="text-2xl font-black text-white font-['Outfit']">
              {analytics.totalUsers}
            </div>
            <div className="text-[11px] text-slate-400">
              Roles: Farmer, Expert, Admin
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Expert Verifications
            </span>
            <div className="text-2xl font-black text-teal-400 font-['Outfit']">
              {analytics.verifiedCases}
            </div>
            <div className="text-[11px] text-slate-400">
              Flagged Pending: {analytics.flaggedCases}
            </div>
          </div>
        </div>
      )}

      {/* Model Calibration & Threshold Tuning */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>Model Threshold Calibration</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure minimum confidence floors before classifying crop species and diseases (Section 45)
            </p>
          </div>
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thresholds Saved & Audited</span>
            </span>
          )}
        </div>

        {models.map((model) => (
          <div key={model.id} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-white text-sm">
                {model.name} ({model.version})
              </span>
              <div className="flex items-center gap-3 font-mono text-slate-400">
                <span>Validation Accuracy: <strong className="text-emerald-400">{model.accuracy}%</strong></span>
                <span>F1-Score: <strong className="text-emerald-400">{model.f1_score}%</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Plant ID Confidence Cutoff</span>
                  <span className="font-mono text-emerald-400 font-bold">{plantThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="90"
                  step="1"
                  value={plantThreshold}
                  onChange={(e) => setPlantThreshold(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Predictions below this threshold will report plant as "Unknown" without guessing.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Disease ID Confidence Cutoff</span>
                  <span className="font-mono text-emerald-400 font-bold">{diseaseThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="90"
                  step="1"
                  value={diseaseThreshold}
                  onChange={(e) => setDiseaseThreshold(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Predictions below this cutoff are automatically routed to Agriculture Experts for review.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveThresholds(model.id)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Apply Model Thresholds
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Trail Logs */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Relational Audit Trail (Last 50 Events)</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Immutable Log</span>
        </div>

        <div className="max-h-[300px] overflow-y-auto space-y-2 text-xs font-mono pr-1">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-300"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-emerald-400 font-bold uppercase">{log.action}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">[{log.target_table}]</span>
                <span className="truncate">{log.details}</span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
