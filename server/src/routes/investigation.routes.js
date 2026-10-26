import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Investigation } from '../models/Investigation.js';
import { ownedRecords } from '../services/mystery.service.js';
import { submitAccusation } from '../services/verdict.service.js';
import { AppError, asyncRoute } from '../middleware/errors.js';
import { accusationLimiter } from '../middleware/rateLimiter.js';

export const investigationRoutes = Router();
investigationRoutes.post('/:investigationId/discoveries', asyncRoute(async (req, res) => {
  const { evidenceId } = z.object({ evidenceId: z.string().min(1).max(80) }).strict().parse(req.body);
  if (!mongoose.isValidObjectId(req.params.investigationId)) throw new AppError(404, 'INVESTIGATION_NOT_FOUND', 'That investigation could not be found.');
  const investigation = await Investigation.findOne({ _id: req.params.investigationId, ownerId: req.ownerId });
  if (!investigation) throw new AppError(404, 'INVESTIGATION_NOT_FOUND', 'That investigation could not be found.');
  const { mystery } = await ownedRecords(String(investigation.mysteryId), req.ownerId);
  if (!mystery.caseData.evidence.some(e => e.evidenceId === evidenceId)) throw new AppError(400, 'INVALID_EVIDENCE', 'That evidence does not belong to this investigation.');
  if (!investigation.discoveredEvidenceIds.includes(evidenceId)) await Investigation.updateOne({ _id: investigation._id, ownerId: req.ownerId }, { $addToSet: { discoveredEvidenceIds: evidenceId } });
  res.json({ success: true, data: { evidenceId, discovered: true } });
}));
investigationRoutes.post('/:investigationId/accusation', accusationLimiter, asyncRoute(async (req, res) => {
  const { suspectId } = z.object({ suspectId: z.string().min(1).max(80) }).strict().parse(req.body);
  const investigation = mongoose.isValidObjectId(req.params.investigationId) && await Investigation.findOne({ _id: req.params.investigationId, ownerId: req.ownerId });
  if (!investigation) throw new AppError(404, 'INVESTIGATION_NOT_FOUND', 'That investigation could not be found.');
  const result = await submitAccusation(String(investigation.mysteryId), req.ownerId, suspectId);
  res.json({ success: true, data: result });
}));
investigationRoutes.get('/:investigationId/verdict', asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.investigationId)) throw new AppError(404, 'INVESTIGATION_NOT_FOUND', 'That investigation could not be found.');
  const investigation = await Investigation.findOne({ _id: req.params.investigationId, ownerId: req.ownerId });
  if (!investigation) throw new AppError(404, 'INVESTIGATION_NOT_FOUND', 'That investigation could not be found.');
  if (investigation.status !== 'completed') throw new AppError(409, 'VERDICT_NOT_READY', 'Submit your final accusation to open the verdict.');
  const { mystery } = await ownedRecords(String(investigation.mysteryId), req.ownerId);
  res.json({ success: true, data: { isCorrect: investigation.result.isCorrect, score: investigation.result.score, selectedSuspectId: investigation.selectedSuspectId, culpritSuspectId: mystery.solution.culpritSuspectId, explanation: investigation.result.explanation, supportingEvidenceIds: investigation.result.supportingEvidenceIds, motive: mystery.solution.motive, method: mystery.solution.method } });
}));
