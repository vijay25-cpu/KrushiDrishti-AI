/**
 * KRUSHIDRISHTI AI — Visual Overlay & Grad-CAM Heatmap Component
 * Developed by Sopan Pandit Gavali
 */

import React, { useEffect, useRef, useState } from 'react';
import { LocalizationBox } from '../types.js';
import { Eye, Layers, Sparkles, Sliders, Maximize2, ShieldAlert } from 'lucide-react';

interface Props {
  imageUrl: string;
  boxes: LocalizationBox[];
  attentionMatrix: number[][];
  explainabilityText?: string;
  severity?: string;
}

export const VisualOverlay: React.FC<Props> = ({
  imageUrl,
  boxes = [],
  attentionMatrix = [],
  explainabilityText,
  severity,
}) => {
  const [viewMode, setViewMode] = useState<'original' | 'boxes' | 'heatmap' | 'combined'>('combined');
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.65);
  const [hoverIntensity, setHoverIntensity] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Helper to map normalized attention value (0 to 1) to Jet/Turbo RGBA
  const getColormapColor = (v: number, opacity: number): [number, number, number, number] => {
    const val = Math.min(1, Math.max(0, v));
    let r = 0, g = 0, b = 0;

    // Turbo / Jet pseudo-colormap
    if (val < 0.25) {
      // 0 to 0.25: deep blue to cyan
      const t = val / 0.25;
      r = 0;
      g = Math.round(t * 255);
      b = 255;
    } else if (val < 0.5) {
      // 0.25 to 0.5: cyan to green
      const t = (val - 0.25) / 0.25;
      r = 0;
      g = 255;
      b = Math.round((1 - t) * 255);
    } else if (val < 0.75) {
      // 0.5 to 0.75: green to yellow
      const t = (val - 0.5) / 0.25;
      r = Math.round(t * 255);
      g = 255;
      b = 0;
    } else {
      // 0.75 to 1.0: yellow to red
      const t = (val - 0.75) / 0.25;
      r = 255;
      g = Math.round((1 - t) * 255);
      b = 0;
    }

    // Boost transparency for low activations so original leaf remains visible
    const alpha = val < 0.15 ? val * 0.5 * opacity : opacity;
    return [r, g, b, alpha];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      // Set canvas coordinate dimensions matching image natural aspect ratio
      const width = img.naturalWidth || 800;
      const height = img.naturalHeight || 600;
      canvas.width = width;
      canvas.height = height;

      // 1. Draw original base image
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // 2. Draw Grad-CAM Heatmap if active
      if (viewMode === 'heatmap' || viewMode === 'combined') {
        const matrix = attentionMatrix.length === 8 ? attentionMatrix : Array(8).fill(0).map(() => Array(8).fill(0.1));
        
        // Create an offscreen low-res 8x8 canvas
        const heatCanvas = document.createElement('canvas');
        heatCanvas.width = 8;
        heatCanvas.height = 8;
        const heatCtx = heatCanvas.getContext('2d');

        if (heatCtx) {
          const imgData = heatCtx.createImageData(8, 8);
          for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
              const val = matrix[y] && matrix[y][x] !== undefined ? matrix[y][x] : 0;
              const [r, g, b, a] = getColormapColor(val, heatmapOpacity);
              const idx = (y * 8 + x) * 4;
              imgData.data[idx] = r;
              imgData.data[idx + 1] = g;
              imgData.data[idx + 2] = b;
              imgData.data[idx + 3] = Math.round(a * 255);
            }
          }
          heatCtx.putImageData(imgData, 0, 0);

          // Smooth upscale onto main canvas using bicubic filter
          ctx.save();
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(heatCanvas, 0, 0, width, height);
          ctx.restore();
        }
      }

      // 3. Draw Bounding Boxes if active
      if (viewMode === 'boxes' || viewMode === 'combined') {
        boxes.forEach((box, i) => {
          const [ymin, xmin, ymax, xmax] = box.box_2d;
          const bx = (xmin / 1000) * width;
          const by = (ymin / 1000) * height;
          const bw = ((xmax - xmin) / 1000) * width;
          const bh = ((ymax - ymin) / 1000) * height;

          // Box styling
          ctx.lineWidth = Math.max(3, Math.round(width / 250));
          ctx.strokeStyle = '#ef4444'; // Emerald/Red accent
          ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
          
          // Draw rect
          ctx.strokeRect(bx, by, bw, bh);
          ctx.fillRect(bx, by, bw, bh);

          // Label pill
          const labelText = `${box.label || 'Lesion'} (${box.confidence || 90}%)`;
          ctx.font = `bold ${Math.max(14, Math.round(width / 45))}px "Plus Jakarta Sans", sans-serif`;
          const textMetrics = ctx.measureText(labelText);
          const textWidth = textMetrics.width;
          const textHeight = Math.max(18, Math.round(width / 35));

          const pillX = Math.max(0, Math.min(bx, width - textWidth - 16));
          const pillY = Math.max(textHeight + 6, by - 6);

          // Pill background
          ctx.fillStyle = '#b91c1c';
          ctx.beginPath();
          ctx.roundRect(pillX, pillY - textHeight, textWidth + 14, textHeight + 6, [4, 4, 4, 4]);
          ctx.fill();

          // Pill text
          ctx.fillStyle = '#ffffff';
          ctx.fillText(labelText, pillX + 7, pillY - 4);
        });
      }
    };
  }, [imageUrl, viewMode, heatmapOpacity, boxes, attentionMatrix]);

  // Handle hover on canvas to sample local heat intensity
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    if (x >= 0 && x <= 1 && y >= 0 && y <= 1 && attentionMatrix.length === 8) {
      const col = Math.min(7, Math.floor(x * 8));
      const row = Math.min(7, Math.floor(y * 8));
      const intensity = attentionMatrix[row]?.[col] || 0;
      setHoverIntensity(Math.round(intensity * 100));
    }
  };

  const handleMouseLeave = () => {
    setHoverIntensity(null);
  };

  return (
    <div
      ref={containerRef}
      id="krushidrishti-visual-overlay"
      className={`relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 flex flex-col shadow-2xl bg-slate-950/95 backdrop-blur-md' : ''
      }`}
    >
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/90 border-b border-slate-800 text-sm">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs sm:text-sm flex items-center gap-1.5 ${
              viewMode === 'original'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Original</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('boxes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs sm:text-sm flex items-center gap-1.5 ${
              viewMode === 'boxes'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Lesion Bounding Boxes</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs sm:text-sm flex items-center gap-1.5 ${
              viewMode === 'heatmap'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Heatmap (Grad-CAM)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('combined')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs sm:text-sm flex items-center gap-1.5 ${
              viewMode === 'combined'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Combined</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {(viewMode === 'heatmap' || viewMode === 'combined') && (
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Opacity: {Math.round(heatmapOpacity * 100)}%</span>
              <input
                type="range"
                min="0.1"
                max="0.95"
                step="0.05"
                value={heatmapOpacity}
                onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                className="w-16 sm:w-20 accent-emerald-500 h-1 cursor-pointer"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
            title="Toggle Expanded View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="relative flex items-center justify-center p-2 sm:p-4 bg-black/40 min-h-[340px] max-h-[580px] overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="max-h-[520px] w-auto max-w-full object-contain rounded-lg shadow-lg cursor-crosshair"
        />

        {/* Live Cursor Attention Intensity Probe */}
        {hoverIntensity !== null && (viewMode === 'heatmap' || viewMode === 'combined') && (
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-emerald-400 text-xs px-2.5 py-1.5 rounded-md shadow-md pointer-events-none flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Spatial Model Activation: <strong>{hoverIntensity}%</strong></span>
          </div>
        )}

        {/* Heatmap Legend */}
        {(viewMode === 'heatmap' || viewMode === 'combined') && (
          <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-300 flex flex-col gap-1.5 shadow-xl">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              <span>Low Activation</span>
              <span>Peak Focus</span>
            </div>
            <div className="w-36 h-2.5 rounded-full bg-gradient-to-r from-blue-600 via-emerald-500 via-amber-400 to-red-600" />
            <div className="text-[10px] text-slate-400 text-center font-mono">Grad-CAM Spatial Evidence</div>
          </div>
        )}
      </div>

      {/* Explainable Text Banner */}
      {explainabilityText && (
        <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
          <div className="p-1 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-emerald-400">Explainable AI Diagnostic Evidence: </span>
            <span className="text-slate-300">{explainabilityText}</span>
          </div>
        </div>
      )}
    </div>
  );
};
