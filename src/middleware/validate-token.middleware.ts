import { type NextFunction, type Request, type Response } from 'express';
import jwt, { JsonWebTokenError, type JwtPayload, TokenExpiredError } from 'jsonwebtoken';

export function validateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Response<any, Record<string, any>> | undefined {
  try {
    const secretKey = process.env.JWT_SECRECT_KEY ?? '';
    const token = req.headers.authorization?.split(' ')[1] ?? '';

    if (token === '') {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Unauthorized',
      });
    }

    const decoded = jwt.verify(token, secretKey);
    const { payload } = decoded as JwtPayload;
    const { user } = payload;
    if (user === null || user === undefined) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Unauthorized',
      });
    }

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({
          success: false,
          data: null,
          message: 'Token is expired',
        });
      }

      return res.status(401).json({
        success: false,
        data: null,
        message: error.message,
      });
    }

    return res.status(401).json({
      success: false,
      data: null,
      message: 'Unauthorized',
    });
  }
}
