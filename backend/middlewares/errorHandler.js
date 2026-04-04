import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      path: issue.path.join('.') || 'body',
      message: issue.message,
    }));

    return res.status(400).json({
      error: 'Validación Zod fallida',
      details,
    });
  }

  console.error(err);

  return res.status(err.statusCode || 500).json({
    error: err.message || 'Error interno del servidor',
  });
};;