import { Router } from 'express';
import { Mystery } from '../models/Mystery.js';
import { Investigation } from '../models/Investigation.js';
import { createRequestSchema } from '../validators/mystery.schema.js';
import { generateMystery } from '../services/gemini.service.js';
import { ownedRecords, publicMystery } from '../services/mystery.service.js';
import { AppError, asyncRoute } from '../middleware/errors.js';
import { generationLimiter } from '../middleware/rateLimiter.js';

export function mysteryRoutes(config) {
  const router = Router();
  router.post('/', generationLimiter, asyncRoute(async (req, res) => {
    const request = createRequestSchema.parse(req.body);
    const generated = await generateMystery(request, { apiKey: config.geminiKey, model: config.geminiModel });
    const mystery = await Mystery.create({ title: generated.title, scenario: request.scenario, genre: request.genre, difficulty: request.difficulty, caseData: { summary: generated.summary, setting: generated.setting, incident: { type: generated.incident.type, description: generated.incident.description, occurredAt: new Date(generated.incident.occurredAt) }, suspects: generated.suspects, timeline: generated.timeline.map(e => ({ ...e, occurredAt: new Date(e.occurredAt) })), evidence: generated.evidence }, solution: generated.solution, generation: { provider: 'google-gemini', model: config.geminiModel, promptVersion: '1.0.0', status: 'validated' }, ownerId: req.ownerId });
    const investigation = await Investigation.create({ mysteryId: mystery._id, ownerId: req.ownerId });
    res.status(201).json({ success: true, data: { caseId: String(mystery._id), investigationId: String(investigation._id), title: mystery.title, status: investigation.status } });
  }));
  router.get('/', asyncRoute(async (req, res) => {
    const investigations = await Investigation.find({ ownerId: req.ownerId }).sort({ updatedAt: -1 }).limit(50).lean();
    const ids = investigations.map(i => i.mysteryId);
    const mysteries = await Mystery.find({ _id: { $in: ids }, ownerId: req.ownerId }).select('title genre createdAt').lean();
    const byId = new Map(mysteries.map(m => [String(m._id), m]));
    res.json({ success: true, data: investigations.flatMap(i => { const m = byId.get(String(i.mysteryId)); return m ? [{ caseId: String(m._id), title: m.title, genre: m.genre, createdAt: m.createdAt, status: i.status, result: i.result?.completedAt ? { isCorrect: i.result.isCorrect, score: i.result.score } : null }] : []; }) });
  }));
  router.get('/:caseId', asyncRoute(async (req, res) => { const { mystery, investigation } = await ownedRecords(req.params.caseId, req.ownerId); res.json({ success: true, data: publicMystery(mystery, investigation) }); }));
  router.get('/:caseId/evidence/:evidenceId', asyncRoute(async (req, res) => {
    const { mystery, investigation } = await ownedRecords(req.params.caseId, req.ownerId);
    const evidence = mystery.caseData.evidence.find(item => item.evidenceId === req.params.evidenceId);
    if (!evidence) throw new AppError(404, 'EVIDENCE_NOT_FOUND', 'That evidence is not part of this case.');
    res.json({ success: true, data: { ...evidence.toObject(), discovered: investigation.discoveredEvidenceIds.includes(evidence.evidenceId) } });
  }));
  return router;
}
