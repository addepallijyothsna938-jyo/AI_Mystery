import mongoose from 'mongoose';

const investigationSchema = new mongoose.Schema({
  mysteryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mystery', required: true, index: true }, ownerId: { type: String, required: true, index: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' }, discoveredEvidenceIds: { type: [String], default: [] }, selectedSuspectId: String,
  accusation: { suspectId: String, submittedAt: Date }, result: { isCorrect: Boolean, score: Number, completedAt: Date, explanation: String, supportingEvidenceIds: [String] }
}, { timestamps: true });
investigationSchema.index({ ownerId: 1, updatedAt: -1 });
investigationSchema.index({ mysteryId: 1, ownerId: 1 }, { unique: true });
export const Investigation = mongoose.model('Investigation', investigationSchema);
