import { Request, Response, NextFunction } from 'express';

function parseKeys(raw?: string): Set<string> {
  if (!raw) return new Set();
  return new Set(raw.split(',').map(s => s.trim()).filter(Boolean));
}

export function apiKeyMiddleware(options?: { headerName?: string, allowInDev?: boolean }){
  const header = options?.headerName || 'x-api-key';
  const allowInDev = options?.allowInDev ?? true;
  const raw = process.env.API_KEY;
  const keys = parseKeys(raw);

  return function (req: Request, res: Response, next: NextFunction){
    // dev bypass
    if (allowInDev && process.env.NODE_ENV === 'development' && (!raw || raw.length === 0)){
      return next();
    }
    const auth = (req.header('authorization') || '').trim();
    let token = '';
    if (auth.toLowerCase().startsWith('bearer ')){
      token = auth.slice(7).trim();
    }
    if (!token){
      token = (req.header('x-api-key') || '').trim();
    }
    if (!token || !keys.has(token)){
      res.status(401).json({ error: 'missing or invalid API key' });
      return;
    }
    next();
  }
}
