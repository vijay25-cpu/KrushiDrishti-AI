/**
 * KRUSHIDRISHTI AI — Scan & Inference View
 * Developed by Sopan Pandit Gavali
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Camera, Upload, RefreshCw, AlertTriangle, CheckCircle2, Sparkles, Image as ImageIcon, ArrowRight, ShieldAlert, Sprout } from 'lucide-react';
import { Language, AnalysisRecordData } from '../types.js';
import { TRANSLATIONS } from '../i18n.js';
import { api } from '../api.js';
import { CROP_OPTIONS, CropOption } from '../utils/cropLocalization.js';
import { SAMPLE_SPECIMENS, SampleSpecimenItem } from '../utils/sampleSpecimens.js';

interface Props {
  lang: Language;
  onScanComplete: (record: AnalysisRecordData) => void;
  onRequestExpert: () => void;
}

export const ScanView: React.FC<Props> = ({ lang, onScanComplete, onRequestExpert }) => {
  const t = TRANSLATIONS[lang];

  const [selectedCrop, setSelectedCrop] = useState<string>('auto');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [qualityError, setQualityError] = useState<{
    message: string;
    guidance: string[];
    issues: string[];
  } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Pre-generate specimen thumbnails once in memory for instant display
  const specimenThumbnails = useMemo(() => {
    return SAMPLE_SPECIMENS.map((item) => ({
      ...item,
      thumbnail: item.generateDataUrl(),
    }));
  }, []);

  const processingSteps = [
    t.stages.uploading,
    t.stages.checkingQuality,
    t.stages.detectingPlant,
    t.stages.identifyingPlant,
    t.stages.analyzingHealth,
    t.stages.detectingDisease,
    t.stages.localizingSymptoms,
    t.stages.estimatingSeverity,
    t.stages.generatingHeatmap,
    t.stages.preparingResult,
  ];

  // Stop camera stream safely on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setQualityError(null);
    setGeneralError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera stream request failed, offering file capture:', err);
      setGeneralError('Direct camera stream not supported or permission denied. Please use the "Upload / Camera" file button.');
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const switchCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const captureSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setSelectedImage(dataUrl);
    stopCamera();
    setQualityError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setGeneralError('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setQualityError(null);
      setGeneralError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setQualityError(null);
        setGeneralError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSampleSpecimen = (item: SampleSpecimenItem) => {
    setQualityError(null);
    setGeneralError(null);
    try {
      const dataUrl = item.generateDataUrl();
      setSelectedImage(dataUrl);
      setSelectedCrop(item.crop);
    } catch (err) {
      console.error('Failed to generate specimen canvas:', err);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setActiveStep(0);
    setQualityError(null);
    setGeneralError(null);

    // Animate through diagnostic stages
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < processingSteps.length - 2) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      const result = await api.predict(selectedImage, 'image/jpeg', selectedCrop);

      clearInterval(stepInterval);
      setActiveStep(processingSteps.length - 1);

      if (result.quality_error) {
        setQualityError({
          message: result.message,
          guidance: result.quality_details?.guidance || [
            t.quality.tip1,
            t.quality.tip2,
            t.quality.tip3,
            t.quality.tip4,
            t.quality.tip5,
            t.quality.tip6,
          ],
          issues: result.quality_details?.issues || [],
        });
        setIsAnalyzing(false);
        return;
      }

      if (result.data) {
        setTimeout(() => {
          setIsAnalyzing(false);
          onScanComplete(result.data);
        }, 500);
      } else {
        throw new Error(result.error || 'Diagnostic evaluation failed');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setGeneralError(err.message || 'Analysis could not be completed. Please try with another photo.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit']">
          {t.scan.heading}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          {t.scan.subheading}
        </p>

        {/* Crop Context Selection Filter */}
        <div className="pt-2 max-w-md mx-auto">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-3.5 py-2 shadow-inner">
            <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-300 shrink-0">
              Crop:
            </span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-transparent text-emerald-400 font-bold text-xs w-full focus:outline-none cursor-pointer"
            >
              {CROP_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id === 'auto' ? 'auto' : opt.nameEn} className="bg-slate-900 text-slate-200">
                  {lang === 'mr' && opt.nameMr ? `${opt.nameMr} (${opt.nameEn})` : lang === 'hi' && opt.nameHi ? `${opt.nameHi} (${opt.nameEn})` : opt.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Camera Live Stream Viewfinder */}
      {isCameraActive && (
        <div className="relative bg-black rounded-3xl overflow-hidden border border-emerald-500/50 shadow-2xl p-2 sm:p-4">
          <div className="relative aspect-video sm:aspect-[4/3] max-h-[460px] mx-auto rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Target Reticle for Leaf Centering */}
            <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-emerald-400/70 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-emerald-400/40" />
            </div>

            <div className="absolute top-4 left-4 bg-slate-900/90 text-emerald-400 text-xs px-3 py-1 rounded-lg backdrop-blur-sm border border-slate-700">
              {t.scan.cameraLive}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4 py-2">
            <button
              type="button"
              onClick={switchCameraFacing}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.scan.switchCamera}</span>
            </button>

            <button
              type="button"
              onClick={captureSnapshot}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-950 hover:scale-105 transition-all"
            >
              <Camera className="w-5 h-5" />
              <span>{t.scan.takePhoto}</span>
            </button>

            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-2 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 hover:bg-red-900 text-xs font-semibold"
            >
              {t.scan.closeCamera}
            </button>
          </div>
        </div>
      )}

      {/* Selected Image Preview & Action Controls */}
      {selectedImage && !isCameraActive && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {t.scan.preview}
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setQualityError(null);
                setGeneralError(null);
              }}
              className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Choose Another Photo</span>
            </button>
          </div>

          <div className="relative max-h-[420px] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
            <img
              src={selectedImage}
              alt="Leaf Specimen"
              className="max-h-[400px] w-auto max-w-full object-contain rounded-xl"
            />
          </div>

          {/* Error Message if General Failure */}
          {generalError && (
            <div className="p-4 rounded-2xl bg-red-950/70 border border-red-800 text-red-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-red-300">Analysis Notice</div>
                  <div className="text-xs text-red-200/90 mt-0.5">{generalError}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Analysis</span>
              </button>
            </div>
          )}

          {/* Quality Error Diagnostic Box (Prompt Requirement Section 9) */}
          {qualityError && (
            <div className="p-5 rounded-2xl bg-amber-950/60 border border-amber-800 text-amber-200 text-xs sm:text-sm space-y-3">
              <div className="flex items-start gap-2.5 font-bold text-amber-300 text-sm sm:text-base">
                <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                <span>{qualityError.message}</span>
              </div>

              {qualityError.issues.length > 0 && (
                <div className="text-xs text-amber-300/90">
                  <span className="font-semibold">Detected Issues: </span>
                  <span>{qualityError.issues.join(', ')}</span>
                </div>
              )}

              <div className="pt-2 border-t border-amber-800/60">
                <div className="font-semibold text-amber-300 mb-2">
                  {t.quality.tipsTitle}
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-200/90">
                  {qualityError.guidance.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold"
                >
                  {t.scan.uploadBetter}
                </button>
                <button
                  type="button"
                  onClick={onRequestExpert}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-800 text-xs font-medium"
                >
                  {t.scan.requestExpert}
                </button>
              </div>
            </div>
          )}

          {/* Real-time Progress Stepper during Processing */}
          {isAnalyzing ? (
            <div className="space-y-4 p-5 rounded-2xl bg-slate-950 border border-emerald-800/60">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>{processingSteps[activeStep]}</span>
                </div>
                <span>
                  {Math.round(((activeStep + 1) / processingSteps.length) * 100)}%
                </span>
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${((activeStep + 1) / processingSteps.length) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-slate-400 pt-2">
                {processingSteps.map((step, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 truncate ${
                      i <= activeStep ? 'text-emerald-400 font-medium' : 'text-slate-600'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        i <= activeStep ? 'bg-emerald-400' : 'bg-slate-700'
                      }`}
                    />
                    <span className="truncate">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              id="analyze-image-button"
              onClick={startAnalysis}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t.scan.analyzeBtn}</span>
            </button>
          )}
        </div>
      )}

      {/* Upload / Camera Input Cards when No Image is Selected */}
      {!selectedImage && !isCameraActive && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Direct Camera Button */}
            <div
              onClick={startCamera}
              className="p-8 rounded-3xl bg-slate-900/90 border-2 border-dashed border-slate-700 hover:border-emerald-500/80 cursor-pointer text-center space-y-3 transition-all hover:bg-slate-850 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <Camera className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base font-['Outfit']">
                  {t.scan.captureBtn}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Open live viewfinder with environment camera
                </p>
              </div>
            </div>

            {/* Gallery Upload Card */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="p-8 rounded-3xl bg-slate-900/90 border-2 border-dashed border-slate-700 hover:border-emerald-500/80 cursor-pointer text-center space-y-3 transition-all hover:bg-slate-850 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-950/80 text-teal-400 border border-teal-800/60 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base font-['Outfit']">
                  {t.scan.uploadBtn}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  JPG, JPEG, PNG, or WebP photo from device
                </p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Quick Curated Test Specimens */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Or Select a Field Test Specimen:</span>
              </span>
              <span className="text-[11px] text-slate-500">Instant AI Diagnosis Test</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {specimenThumbnails.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadSampleSpecimen(item)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/80 cursor-pointer transition-all hover:scale-[1.02] group"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-24 object-cover rounded-lg mb-2 border border-slate-800/80"
                  />
                  <div className="text-xs font-semibold text-white truncate">{item.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{item.caption}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
