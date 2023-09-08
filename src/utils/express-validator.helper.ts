import { type NextFunction, type Request, type Response } from 'express';
import { validationResult } from 'express-validator';

export const expressValidatorCheck = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response<any, Record<string, any>> | undefined => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};
