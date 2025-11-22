export class BaseError extends Error {
 constructor(
  message: string,
  public readonly code: string,
  public readonly statusCode: number = 500,
 ) {
  super(message);
  this.name = this.constructor.name;
  if (typeof (Error as any).captureStackTrace === 'function') {
    (Error as any).captureStackTrace(this, this.constructor);
  }
 }
}

export class ValidationError extends BaseError {
  constructor(message: string){
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string){
    super(message, 'NOT_FOUND', 404);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string){
    super(message, 'CONFLICT', 409);
  }
}