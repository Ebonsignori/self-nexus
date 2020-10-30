// Custom validators extending class-validator
import { ValidationOptions, ValidateIf } from 'class-validator';

export function IsOptional(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateIf((obj, value) => value !== null && value !== undefined && value !== '', validationOptions);
}
