// src/core/utils/response.ts
import { Response } from 'express';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: any[];
}

/**
 * SUCCESS RESPONSE (200)
 */
export const success = (
  res: Response,
  data: any = null,
  message = 'Success',
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * CREATED RESPONSE (201)
 */
export const created = (
  res: Response,
  data: any = null,
  message = 'Created'
) => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};

/**
 * ERROR RESPONSE
 */
export const error = (
  res: Response,
  message = 'Internal Server Error',
  statusCode = 500,
  errors?: any[]
) => {
  const body: ApiResponse = {
    success: false,
    message,
  };

  if (errors) body.errors = errors;

  return res.status(statusCode).json(body);
};

/**
 * VALIDATION ERROR
 */
export const validationError = (res: Response, errors: any[]) => {
  return error(res, 'Validation Error', 400, errors);
};

/**
 * PAGINATION RESPONSE
 */
export const paginated = (
  res: Response,
  data: any[],
  total: number,
  page: number,
  limit: number,
  message = 'Success'
) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};