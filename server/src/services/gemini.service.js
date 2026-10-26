import { GoogleGenAI, Type } from '@google/genai';
import { validateCase } from '../validators/mystery.schema.js';
import { mysteryPrompt } from '../prompts/mysteryGeneration.prompt.js';
import { AppError } from '../middleware/errors.js';

const clientFor = (apiKey) => new GoogleGenAI({ apiKey });
const str = { type: Type.STRING };
const strings = { type: Type.ARRAY, items: str };
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: str, summary: str, setting: str,
    incident: { type: Type.OBJECT, properties: { type: str, description: str, occurredAt: str }, required: ['type', 'description', 'occurredAt'] },
    suspects: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { suspectId: str, name: str, age: { type: Type.INTEGER }, occupation: str, relationshipToIncident: str, background: str, motive: str, publicAlibi: str }, required: ['suspectId', 'name', 'occupation', 'relationshipToIncident', 'background', 'motive', 'publicAlibi'] } },
    timeline: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { eventId: str, occurredAt: str, description: str, relatedSuspectIds: strings }, required: ['eventId', 'occurredAt', 'description', 'relatedSuspectIds'] } },
    evidence: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { evidenceId: str, title: str, type: { type: Type.STRING, enum: ['message', 'image', 'audio', 'document', 'physical'] }, description: str, content: str, relatedSuspectIds: strings, timelineEventIds: strings, clueIds: strings, time: str }, required: ['evidenceId', 'title', 'type', 'description', 'content', 'relatedSuspectIds', 'timelineEventIds', 'clueIds'] } },
    solution: { type: Type.OBJECT, properties: { culpritSuspectId: str, motive: str, method: str, explanation: str, clueIds: strings, evidenceIds: strings }, required: ['culpritSuspectId', 'motive', 'method', 'explanation', 'clueIds', 'evidenceIds'] }
  },
  required: ['title', 'summary', 'setting', 'incident', 'suspects', 'timeline', 'evidence', 'solution']
};

export async function generateMystery(request, { apiKey, model }) {
  const client = clientFor(apiKey);
  let correction = '';
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const result = await client.models.generateContent({ model, contents: mysteryPrompt(request, correction), config: { responseMimeType: 'application/json', responseSchema, temperature: 0.75 } });
      const text = result.text;
      const parsed = JSON.parse(text);
      const checked = validateCase(parsed, request);
      return checked;
    } catch (error) {
      lastError = error;
      if (error instanceof SyntaxError || error.name === 'ZodError' || error.code === 'INVALID_MODEL_OUTPUT') {
        correction = 'The previous output did not pass validation. Correct the entire JSON case. Preserve the fixed culprit while correcting schema errors and all references.';
        continue;
      }
      if (error.status === 429) throw new AppError(429, 'AI_RATE_LIMITED', 'The story engine is busy. Please wait a moment and try again.');
      if (error.status === 504 || error.name === 'AbortError') throw new AppError(504, 'AI_TIMEOUT', 'The case writer took too long. Your premise is saved; please retry.');
      break;
    }
  }
  if (lastError?.code === 'INVALID_MODEL_OUTPUT') throw lastError;
  console.error('Gemini generation failed:', lastError?.message || 'Unknown error');
  throw new AppError(502, 'AI_GENERATION_FAILED', 'The story engine could not complete this case. Your premise is safe; please retry.');
}
