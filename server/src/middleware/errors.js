export class AppError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
export const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
export function notFound(req, res) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'That archive record could not be found.' } }); }
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const isZodError = error.name === 'ZodError';
  const status = error.status || (isZodError || error.name === 'ValidationError' ? 400 : 500);
  const code = error.code || (status === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR');
  const message = status >= 500 ? 'The archive hit an unexpected problem. Please try again.' : isZodError ? 'Please check the case fields and try again.' : error.message;
  if (status >= 500) console.error('Request failed:', error.message);
  res.status(status).json({ success: false, error: { code, message } });
}
