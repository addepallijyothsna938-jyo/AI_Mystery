import mongoose from 'mongoose';

const suspectSchema = new mongoose.Schema({ suspectId: { type: String, required: true }, name: String, age: Number, occupation: String, relationshipToIncident: String, background: String, motive: String, publicAlibi: String, initials: String, color: String }, { _id: false });
const timelineSchema = new mongoose.Schema({ eventId: String, occurredAt: Date, description: String, relatedSuspectIds: [String] }, { _id: false });
const evidenceSchema = new mongoose.Schema({ evidenceId: { type: String, required: true }, title: String, type: String, description: String, content: mongoose.Schema.Types.Mixed, mediaUrl: String, relatedSuspectIds: [String], timelineEventIds: [String], clueIds: [String], time: String }, { _id: false });
const mysterySchema = new mongoose.Schema({
  title: { type: String, required: true }, scenario: { type: String, required: true }, genre: String, difficulty: String,
  caseData: { summary: String, setting: String, incident: { type: { type: String }, description: String, occurredAt: Date }, suspects: [suspectSchema], timeline: [timelineSchema], evidence: [evidenceSchema] },
  solution: { culpritSuspectId: String, motive: String, method: String, explanation: String, clueIds: [String], evidenceIds: [String] },
  generation: { provider: String, model: String, promptVersion: String, status: String }, ownerId: { type: String, required: true, index: true }
}, { timestamps: true, minimize: false });
mysterySchema.index({ ownerId: 1, createdAt: -1 });
export const Mystery = mongoose.model('Mystery', mysterySchema);
