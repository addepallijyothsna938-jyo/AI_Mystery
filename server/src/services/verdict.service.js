import { Investigation } from '../models/Investigation.js';
import { AppError } from '../middleware/errors.js';
import { ownedRecords } from './mystery.service.js';

export async function submitAccusation(caseId, ownerId, suspectId) {
  const { mystery, investigation } = await ownedRecords(caseId, ownerId);
  if (investigation.status !== 'active') throw new AppError(409, 'INVESTIGATION_COMPLETED', 'This investigation already has a final verdict.');
  if (!mystery.caseData.suspects.some(s => s.suspectId === suspectId)) throw new AppError(400, 'INVALID_SUSPECT', 'Choose a suspect from this case file.');
  const isCorrect = mystery.solution.culpritSuspectId === suspectId;
  const completedAt = new Date();
  const updated = await Investigation.findOneAndUpdate(
    { _id: investigation._id, ownerId, status: 'active' },
    { $set: { status: 'completed', selectedSuspectId: suspectId, accusation: { suspectId, submittedAt: completedAt }, result: { isCorrect, score: isCorrect ? 100 : 0, completedAt, explanation: mystery.solution.explanation, supportingEvidenceIds: mystery.solution.evidenceIds } } },
    { new: true, runValidators: true }
  );
  if (!updated) throw new AppError(409, 'INVESTIGATION_COMPLETED', 'This investigation already has a final verdict.');
  return { isCorrect, score: isCorrect ? 100 : 0, selectedSuspectId: suspectId, culpritSuspectId: mystery.solution.culpritSuspectId, explanation: mystery.solution.explanation, motive: mystery.solution.motive, method: mystery.solution.method, supportingEvidenceIds: mystery.solution.evidenceIds };
}
