import mongoose from 'mongoose';
import { Mystery } from '../models/Mystery.js';
import { Investigation } from '../models/Investigation.js';
import { AppError } from '../middleware/errors.js';

export function publicMystery(mystery, investigation) {
  const d = mystery.caseData;
  return {
    caseId: String(mystery._id), investigationId: String(investigation._id), title: mystery.title, summary: d.summary, setting: d.setting,
    incident: d.incident, suspects: d.suspects, timeline: d.timeline, evidence: d.evidence.map(e => ({ ...(e.toObject ? e.toObject() : e), found: investigation.discoveredEvidenceIds.includes(e.evidenceId) })),
    genre: mystery.genre, difficulty: mystery.difficulty, status: investigation.status, progress: d.evidence.length ? Math.round(investigation.discoveredEvidenceIds.length / d.evidence.length * 100) : 0,
    solution: investigation.status === 'completed' ? mystery.solution : undefined,
    verdict: investigation.result?.completedAt ? { ...(investigation.result.toObject ? investigation.result.toObject() : investigation.result), selectedSuspectId: investigation.selectedSuspectId, culpritSuspectId: mystery.solution.culpritSuspectId } : undefined
  };
}

export async function ownedRecords(caseId, ownerId) {
  if (!mongoose.isValidObjectId(caseId)) throw new AppError(404, 'CASE_NOT_FOUND', 'That case file could not be found.');
  const mystery = await Mystery.findOne({ _id: caseId, ownerId });
  const investigation = mystery && await Investigation.findOne({ mysteryId: mystery._id, ownerId });
  if (!mystery || !investigation) throw new AppError(404, 'CASE_NOT_FOUND', 'That case file could not be found.');
  return { mystery, investigation };
}
