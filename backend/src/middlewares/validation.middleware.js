import { ZodError } from 'zod';
import ApiError from '../utils/api.error.js';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
            message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        return next(new ApiError(400, "Invalid input", errorMessages));
    }
    return next(new ApiError(500, 'Internal Server Error'));
  }
};
