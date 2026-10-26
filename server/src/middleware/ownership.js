import crypto from 'node:crypto';

function sign(id, secret) { return crypto.createHmac('sha256', secret).update(id).digest('base64url'); }
export function guestOwnership(secret, production) {
  return (req, res, next) => {
    const token = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith('mystery_session='))?.slice('mystery_session='.length);
    const [id, signature] = (token || '').split('.');
    const expected = id ? sign(id, secret) : '';
    let ownerId = null;
    if (id && signature && expected.length === signature.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) ownerId = id;
    if (!ownerId) {
      ownerId = crypto.randomBytes(32).toString('base64url');
      res.cookie('mystery_session', `${ownerId}.${sign(ownerId, secret)}`, { httpOnly: true, secure: production, sameSite: 'lax', path: '/', maxAge: 30 * 24 * 60 * 60 * 1000 });
    }
    req.ownerId = ownerId;
    next();
  };
}
