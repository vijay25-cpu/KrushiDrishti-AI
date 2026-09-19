/**
 * KRUSHIDRISHTI AI — Frontend Types
 * Developed by Sopan Pandit Gavali
 */

export type Language = 'en' | 'mr' | 'hi';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'farmer' | 'expert' | 'admin';
  organization?: string;
  phone?: string;
}

export interface LocalizationBox {
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
  label: string;
  confidence: number;
}

export interface AnalysisRecordData {
  id: string;
  user_id: string;
  original_image: string;
  plant_name: string;
  scientific_name: string;
  plant_confidence: number;
  health_status: 'Healthy' | 'Diseased' | 'Unknown';
  disease_name: string;
  disease_id?: string;
  disease_confidence: number;
  affected_area_percent: number;
  severity: 'Healthy' | 'Mild' | 'Moderate' | 'Severe' | 'Very Severe';
  model_name: string;
  model_version: string;
  created_at: string;
  localization_boxes: LocalizationBox[];
  attention_matrix: number[][]; // 8x8 heatmap grid
  explainability_text: string;
  image_quality: {
    is_valid: boolean;
    has_plant: boolean;
    blur_score: number;
    brightness_score: number;
    lighting_ok: boolean;
    issues: string[];
    guidance: string[];
  };
  symptoms: string[];
  causes: string[];
  solution: Array<{
    type: string;
    title: string;
    description: string;
    safetyPrecautions?: string;
    dosage?: string;
    phiDays?: number;
  }>;
  prevention: string[];
  is_flagged_for_review: boolean;
  expert_status: 'none' | 'pending' | 'verified' | 'corrected';
  expert_review?: {
    expert_name: string;
    expert_comment: string;
    corrected_plant?: string;
    corrected_disease?: string;
    corrected_severity?: string;
    reviewed_at: string;
  };
}

export interface CropInfo {
  id: string;
  commonName: { en: string; mr: string; hi: string };
  scientificName: string;
  family: string;
  category: string;
  optimalSeason: string;
  commonDiseases: string[];
}

export interface DiseaseInfo {
  id: string;
  name: { en: string; mr: string; hi: string };
  scientificName: string;
  cropId: string;
  cropName: { en: string; mr: string; hi: string };
  pathogenType: string;
  symptoms: { en: string[]; mr: string[]; hi: string[] };
  causes: { en: string[]; mr: string[]; hi: string[] };
  favorableConditions: { en: string; mr: string; hi: string };
  prevention: { en: string[]; mr: string[]; hi: string[] };
  culturalPractices: { en: string[]; mr: string[]; hi: string[] };
  ipmStrategy: { en: string; mr: string; hi: string };
  treatments: Array<{
    type: string;
    title: { en: string; mr: string; hi: string };
    description: { en: string; mr: string; hi: string };
    safetyPrecautions: { en: string; mr: string; hi: string };
    dosage?: string;
    phiDays?: number;
  }>;
  safetyWarnings: { en: string; mr: string; hi: string };
  source: string;
  lastReviewedDate: string;
}
