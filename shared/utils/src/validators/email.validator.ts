const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class EmailValidator {
  static isValid(email: string): boolean {
    return EMAIL_REGEX.test(email);
  }

  static validateOrThrow(email: string, fieldName: string = 'email'): void {
    if (!this.isValid(email)) {
      throw new Error(`${fieldName} must be a valid email address`);
    }
  }
}
