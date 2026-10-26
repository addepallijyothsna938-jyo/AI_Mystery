import { z } from 'zod';
import { AppError } from '../middleware/errors.js';

export const createRequestSchema = z.object({
  scenario: z.string().trim().min(50).max(2000),
  genre: z.enum(['murder mystery', 'theft', 'missing artifact', 'cyber mystery', 'general investigation']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  suspectCount: z.coerce.number().int().min(3).max(6),
  evidenceDensity: z.enum(['low', 'medium', 'high'])
}).strict().superRefine((value, ctx) => {
  const allowed = value.difficulty === 'easy' ? [3, 4] : value.difficulty === 'medium' ? [4, 5] : [5, 6];
  if (!allowed.includes(value.suspectCount)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['suspectCount'], message: `${value.difficulty} cases need ${allowed.join(' or ')} suspects.` });
});

const suspectSchema = z.object({ suspectId: z.string().min(1), name: z.string().min(2), age: z.number().int().min(18).max(120).optional(), occupation: z.string().min(2), relationshipToIncident: z.string().min(2), background: z.string().min(2), motive: z.string().min(2), publicAlibi: z.string().min(2) });
const timelineSchema = z.object({ eventId: z.string().min(1), occurredAt: z.string().min(1), description: z.string().min(2), relatedSuspectIds: z.array(z.string()) });
const evidenceSchema = z.object({ evidenceId: z.string().min(1), title: z.string().min(2), type: z.enum(['message', 'image', 'audio', 'document', 'physical']), description: z.string().min(2), content: z.union([z.string(), z.record(z.unknown())]), relatedSuspectIds: z.array(z.string()), timelineEventIds: z.array(z.string()), clueIds: z.array(z.string()), time: z.string().optional(), mediaUrl: z.string().url().optional() });
export const generatedSchema = z.object({
  title: z.string().min(3).max(100), summary: z.string().min(10), setting: z.string().min(2),
  incident: z.object({ type: z.string().min(2), description: z.string().min(5), occurredAt: z.string().min(1) }),
  suspects: z.array(suspectSchema).min(3).max(6), timeline: z.array(timelineSchema).min(3), evidence: z.array(evidenceSchema).min(4),
  solution: z.object({ culpritSuspectId: z.string().min(1), motive: z.string().min(3), method: z.string().min(3), explanation: z.string().min(15), clueIds: z.array(z.string()).min(2), evidenceIds: z.array(z.string()).min(2) })
});

export function validateCase(raw, request) {
  const parsed = generatedSchema.safeParse(raw);
  if (!parsed.success) throw new AppError(502, 'INVALID_MODEL_OUTPUT', 'The generated case did not pass the archive’s consistency checks. Please retry.');
  const value = parsed.data;
  if (value.suspects.length !== request.suspectCount) throw new AppError(502, 'INVALID_MODEL_OUTPUT', 'The generated suspect count did not match your request. Please retry.');
  const suspectIds = value.suspects.map(s => s.suspectId), evidenceIds = value.evidence.map(e => e.evidenceId), eventIds = value.timeline.map(e => e.eventId), clueIds = value.evidence.flatMap(e => e.clueIds);
  if (new Set(suspectIds).size !== suspectIds.length || new Set(evidenceIds).size !== evidenceIds.length || new Set(eventIds).size !== eventIds.length) throw new AppError(502, 'INVALID_MODEL_OUTPUT', 'The generated case contains duplicate record IDs. Please retry.');
  if (!suspectIds.includes(value.solution.culpritSuspectId)) throw new AppError(502, 'INVALID_MODEL_OUTPUT', 'The generated solution refers to an unknown suspect. Please retry.');
  if (![value.incident.occurredAt, ...value.timeline.map(e => e.occurredAt)].every(date => Number.isFinite(Date.parse(date)))) throw new AppError(502, 'INVALID_MODEL_OUTPUT', 'The generated case contains an invalid timestamp. Please retry.');
  if (value.solution.evidenceIds.some(id => !evidenceIds.includes(id)) || value.solution.clueIds.some(id => !clueIds.includes(id))) throw new AppError(502, 'INVALID_MODEL_OUTPUT', 'The generated solution refers to missing evidence. Please retry.');
  if (value.evidence.some(e => e.relatedSuspectIds.some(id => !suspectIds.includes(id)) || e.timelineEventIds.some(id => !eventIds.includes(id)))) throw new AppError(502, 'INVALID_MODEL_OUTPUT', 'Some generated evidence references are inconsistent. Please retry.');
  if (value.timeline.some(e => e.relatedSuspectIds.some(id => !suspectIds.includes(id)))) throw new AppError(502, 'INVALID_MODEL_OUTPUT', 'The generated timeline references an unknown suspect. Please retry.');
  return value;
}
