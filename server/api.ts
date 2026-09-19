/**
 * KRUSHIDRISHTI AI — REST API Endpoints
 * Developed by Sopan Pandit Gavali
 */

import { Router, Request, Response } from 'express';
import { db, hashPassword, verifyPassword, User } from './db.js';
import { runPlantDiagnosis } from './ai_service.js';
import { VERIFIED_CROPS, VERIFIED_DISEASES } from './knowledge_base.js';

export const apiRouter = Router();

// Simple auth token generator / validator for session authentication
const SESSIONS: Map<string, { userId: string; expires: number }> = new Map();

function generateToken(userId: string): string {
  const token = 'kdr_sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  SESSIONS.set(token, {
    userId,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  return token;
}

export function authenticate(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.substring(7);
  const session = SESSIONS.get(token);
  if (!session || session.expires < Date.now()) {
    if (session) SESSIONS.delete(token);
    return res.status(401).json({ error: 'Session expired, please log in again' });
  }
  const user = db.findUserById(session.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  (req as any).user = user;
  next();
}

function optionalAuth(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const session = SESSIONS.get(token);
    if (session && session.expires > Date.now()) {
      const user = db.findUserById(session.userId);
      if (user) {
        (req as any).user = user;
      }
    }
  }
  next();
}

// ----------------------------------------------------------------------
// 1. AUTHENTICATION (Section 19)
// ----------------------------------------------------------------------

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { email, password, full_name, role, organization, phone } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const { hash, salt } = hashPassword(password);
    const validRole = (role === 'expert' || role === 'admin') ? role : 'farmer';

    const newUser = db.createUser({
      email,
      password_hash: hash,
      salt,
      full_name,
      role: validRole,
      organization: organization || 'Agricultural Producer',
      phone: phone || ''
    });

    const token = generateToken(newUser.id);
    const { password_hash, salt: _, ...safeUser } = newUser;
    return res.json({ token, user: safeUser });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.findUserByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash, user.salt)) {
    return res.status(401).json({ error: 'Invalid credentials. Please verify your email and password.' });
  }

  db.logAudit(user.id, user.email, 'LOGIN', 'users', user.id, 'User logged in successfully');

  const token = generateToken(user.id);
  const { password_hash, salt: _, ...safeUser } = user;
  return res.json({ token, user: safeUser });
});

apiRouter.post('/auth/logout', authenticate, (req: Request, res: Response) => {
  const token = (req.headers.authorization || '').substring(7);
  SESSIONS.delete(token);
  const user = (req as any).user as User;
  db.logAudit(user.id, user.email, 'LOGOUT', 'users', user.id, 'User logged out');
  return res.json({ message: 'Logged out successfully' });
});

apiRouter.get('/auth/me', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { password_hash, salt, ...safeUser } = user;
  return res.json({ user: safeUser });
});

apiRouter.post('/auth/change-password', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { current_password, new_password } = req.body;
  if (!verifyPassword(current_password, user.password_hash, user.salt)) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }
  if (!new_password || new_password.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  const { hash, salt } = hashPassword(new_password);
  db.updateUserPassword(user.id, hash, salt);
  return res.json({ message: 'Password updated successfully' });
});

// ----------------------------------------------------------------------
// 2. PLANT ANALYSIS & PREDICTION (Sections 4, 5, 8, 9, 10, 11, 12, 13, 14, 22)
// ----------------------------------------------------------------------

apiRouter.post('/analysis/predict', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { image, mimeType, crop } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const currentUser = (req as any).user as User | undefined;
    const userId = currentUser ? currentUser.id : 'anonymous_farmer';

    // 1. Run real computer vision inference with multimodal models (with optional crop context)
    const inference = await runPlantDiagnosis(image, mimeType || 'image/jpeg', crop);

    // 2. If quality validation failed or no plant detected, return guidance directly
    if (!inference.image_quality.is_valid || !inference.image_quality.has_plant) {
      return res.json({
        success: false,
        quality_error: true,
        message: !inference.image_quality.has_plant
          ? 'No plant or leaf detected. Please upload a clear plant image.'
          : 'Image quality is insufficient for reliable analysis.',
        quality_details: inference.image_quality,
      });
    }

    // 3. Find matched disease id from knowledge base if any
    let matchedDiseaseId = undefined;
    for (const [key, d] of Object.entries(VERIFIED_DISEASES)) {
      if (
        d.name.en.toLowerCase().includes(inference.disease.name.toLowerCase()) ||
        inference.disease.name.toLowerCase().includes(d.name.en.toLowerCase())
      ) {
        matchedDiseaseId = d.id;
        break;
      }
    }

    // 4. Save analysis record into relational database
    const savedRecord = db.createAnalysis({
      user_id: userId,
      original_image: image,
      plant_name: inference.plant.name,
      scientific_name: inference.plant.scientific_name,
      plant_confidence: inference.plant.confidence,
      health_status: inference.health.status,
      disease_name: inference.disease.name,
      disease_id: matchedDiseaseId,
      disease_confidence: inference.disease.confidence,
      affected_area_percent: inference.localization.affected_area_percent,
      severity: inference.localization.severity,
      model_name: inference.model_name,
      model_version: inference.model_version,
      localization_boxes: inference.localization.boxes,
      attention_matrix: inference.explainable_ai.attention_matrix,
      explainability_text: inference.explainable_ai.evidence_text,
      image_quality: inference.image_quality,
      symptoms: inference.symptoms,
      causes: inference.causes,
      solution: inference.solution,
      prevention: inference.prevention,
      is_flagged_for_review: inference.health.status === 'Diseased' && inference.disease.confidence < 70,
      expert_status: (inference.health.status === 'Diseased' && inference.disease.confidence < 70) ? 'pending' : 'none'
    });

    return res.json({
      success: true,
      data: savedRecord
    });
  } catch (err: any) {
    console.error('Error in /analysis/predict:', err);
    const isHighDemand =
      err?.message?.includes('high demand') ||
      err?.message?.includes('503') ||
      err?.status === 503 ||
      err?.code === 503;

    const statusCode = isHighDemand ? 503 : 500;
    const errorMessage = err?.message || 'Something went wrong while analyzing the image. Please try again.';

    return res.status(statusCode).json({
      error: errorMessage,
      isHighDemand,
      details: err.message,
    });
  }
});

apiRouter.get('/analysis/history', optionalAuth, (req: Request, res: Response) => {
  const currentUser = (req as any).user as User | undefined;
  const userId = currentUser ? currentUser.id : 'anonymous_farmer';
  const role = currentUser ? currentUser.role : 'farmer';

  const history = db.getAnalysesForUser(userId, role);
  return res.json({ history });
});

apiRouter.get('/analysis/:id', (req: Request, res: Response) => {
  const record = db.getAnalysisById(req.params.id);
  if (!record) {
    return res.status(404).json({ error: 'Analysis record not found' });
  }
  return res.json({ data: record });
});

apiRouter.delete('/analysis/:id', optionalAuth, (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user as User | undefined;
    const userId = currentUser ? currentUser.id : 'anonymous_farmer';
    const role = currentUser ? currentUser.role : 'farmer';

    const deleted = db.deleteAnalysis(req.params.id, userId, role);
    if (!deleted) return res.status(404).json({ error: 'Analysis not found' });
    return res.json({ success: true, message: 'Analysis deleted' });
  } catch (err: any) {
    return res.status(403).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------
// 3. PLANT & DISEASE KNOWLEDGE (Section 35)
// ----------------------------------------------------------------------

apiRouter.get('/plants', (req: Request, res: Response) => {
  return res.json({ crops: VERIFIED_CROPS });
});

apiRouter.get('/crops', (req: Request, res: Response) => {
  return res.json({ crops: VERIFIED_CROPS });
});

apiRouter.get('/plants/:id', (req: Request, res: Response) => {
  const crop = VERIFIED_CROPS.find(c => c.id === req.params.id);
  if (!crop) return res.status(404).json({ error: 'Crop not found' });

  // Get associated diseases
  const relatedDiseases = Object.values(VERIFIED_DISEASES).filter(d => d.cropId === crop.id);
  return res.json({ crop, diseases: relatedDiseases });
});

apiRouter.get('/crops/:id', (req: Request, res: Response) => {
  const crop = VERIFIED_CROPS.find(c => c.id === req.params.id);
  if (!crop) return res.status(404).json({ error: 'Crop not found' });

  const relatedDiseases = Object.values(VERIFIED_DISEASES).filter(d => d.cropId === crop.id);
  return res.json({ crop, diseases: relatedDiseases });
});

apiRouter.get('/diseases', (req: Request, res: Response) => {
  const diseases = Object.values(VERIFIED_DISEASES);
  return res.json({ diseases });
});

apiRouter.get('/diseases/:id', (req: Request, res: Response) => {
  const disease = VERIFIED_DISEASES[req.params.id];
  if (!disease) return res.status(404).json({ error: 'Disease not found in knowledge base' });
  return res.json({ disease });
});

apiRouter.get('/recommendations/:disease_id', (req: Request, res: Response) => {
  const disease = VERIFIED_DISEASES[req.params.disease_id];
  if (!disease) return res.status(404).json({ error: 'Disease not found' });
  return res.json({
    disease_id: disease.id,
    disease_name: disease.name,
    treatments: disease.treatments,
    ipm_strategy: disease.ipmStrategy,
    safety_warnings: disease.safetyWarnings,
    source: disease.source,
    last_reviewed: disease.lastReviewedDate
  });
});

// ----------------------------------------------------------------------
// 4. USER FEEDBACK (Section 36)
// ----------------------------------------------------------------------

apiRouter.post('/feedback', optionalAuth, (req: Request, res: Response) => {
  const currentUser = (req as any).user as User | undefined;
  const userId = currentUser ? currentUser.id : 'anonymous_farmer';
  const { analysis_id, helpful_status, issue_type, comment } = req.body;

  if (!analysis_id || !helpful_status) {
    return res.status(400).json({ error: 'Analysis ID and helpful status required' });
  }

  const feedback = db.submitFeedback({
    analysis_id,
    user_id: userId,
    helpful_status,
    issue_type: issue_type || 'None',
    comment: comment || ''
  });

  return res.json({ success: true, feedback });
});

// ----------------------------------------------------------------------
// 5. EXPERT REVIEW (Section 37)
// ----------------------------------------------------------------------

apiRouter.get('/expert/reviews', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  if (user.role !== 'expert' && user.role !== 'admin') {
    return res.status(403).json({ error: 'Access restricted to Agriculture Experts and Admins' });
  }

  const flaggedCases = db.getAnalysesForUser(user.id, user.role).filter(a => a.is_flagged_for_review || a.expert_status !== 'none');
  return res.json({ cases: flaggedCases });
});

apiRouter.post('/expert/review', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  if (user.role !== 'expert' && user.role !== 'admin') {
    return res.status(403).json({ error: 'Access restricted to Agriculture Experts and Admins' });
  }

  const { analysis_id, comment, corrected_plant, corrected_disease, corrected_severity } = req.body;
  if (!analysis_id || !comment) {
    return res.status(400).json({ error: 'Analysis ID and expert comment are required' });
  }

  try {
    const updated = db.submitExpertReview(analysis_id, user, {
      comment,
      corrected_plant,
      corrected_disease,
      corrected_severity
    });
    return res.json({ success: true, analysis: updated });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------
// 6. ADMIN MANAGEMENT & ANALYTICS (Sections 44, 45, 46)
// ----------------------------------------------------------------------

apiRouter.get('/admin/analytics', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  if (user.role !== 'admin' && user.role !== 'expert') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const analytics = db.getAnalytics();
  return res.json({ analytics });
});

apiRouter.get('/admin/users', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const users = db.getAllUsers();
  return res.json({ users });
});

apiRouter.get('/admin/models', (req: Request, res: Response) => {
  const models = db.getActiveModels();
  return res.json({ models });
});

apiRouter.put('/admin/models/:id/thresholds', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const { plant_threshold, disease_threshold } = req.body;
  try {
    const updated = db.updateModelThresholds(req.params.id, Number(plant_threshold), Number(disease_threshold), user);
    return res.json({ success: true, model: updated });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/admin/audit-logs', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  return res.json({ logs: db.getAuditLogs() });
});

apiRouter.get('/admin/system-logs', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  return res.json({ logs: db.getSystemLogs() });
});
