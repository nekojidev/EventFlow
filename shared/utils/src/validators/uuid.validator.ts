import { validate as uuidValidate } from 'uuid';

export class UuidValidator {
  static isValid(uuid: string): boolean {
    return uuidValidate(uuid);
  }

  static validateOrThrow(uuid: string, fieldName: string = 'id'): void {
    if (!this.isValid(uuid)) {
      throw new Error(`${fieldName} must be a valid UUID`);
    }
  }
}
