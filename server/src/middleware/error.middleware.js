import { ZodError } from 'zod';

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      issues: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }))
    });
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: 'A record with this value already exists' });
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ message: error.message || 'Something went wrong' });
}
