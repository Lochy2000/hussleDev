import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { loginSchema, signupSchema, hustleSchema } from '../lib/schemas';

// Schema mapping for different routes
const schemaMap: Record<string, AnyZodObject> = {
  '/api/auth/login': loginSchema,
  '/api/auth/signup': signupSchema,
  '/api/hustles': hustleSchema,
};

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = schemaMap[req.path];
    if (!schema) {
      return next();
    }

    // Validate request body against schema
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 'error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during validation',
    });
  }
};

// Middleware to validate request parameters
export const validateParams = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error during parameter validation',
      });
    }
  };
};