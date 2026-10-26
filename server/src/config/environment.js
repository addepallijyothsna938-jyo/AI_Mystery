import 'dotenv/config';

const required = ['MONGODB_URI', 'GEMINI_API_KEY', 'SESSION_SECRET'];
export function readEnvironment() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required configuration: ${missing.join(', ')}. Copy server/.env.example to server/.env and fill in the values.`);
  if (process.env.SESSION_SECRET.length < 32) throw new Error('SESSION_SECRET must contain at least 32 characters.');
  return {
    port: Number(process.env.PORT || 5000),
    mongoUri: process.env.MONGODB_URI,
    geminiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    sessionSecret: process.env.SESSION_SECRET,
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
