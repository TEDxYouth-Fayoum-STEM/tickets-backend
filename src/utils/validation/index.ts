import {
  ClassConstructor,
  plainToInstance,
  Transform
} from "class-transformer";
import {
  validate as classValidate,
  ValidationError as ClassValidationError
} from "class-validator";

import constraint from "./constraint";
export { constraint, Transform };

function parseValidationErrors(
  result: ClassValidationError[]
): true | string[] | null {
  if (result.length === 0) return true;
  const errors: string[] = [];
  for (const validationError of result) {
    if (!validationError.property) return null;
    errors.push(validationError.property);
  }
  return errors;
}

export async function validate(
  dto: ClassConstructor<object>,
  obj: unknown,
  implicit = false
): Promise<true | string[] | null> {
  const result = await classValidate(
    plainToInstance<object, unknown>(dto, obj, {
      excludeExtraneousValues: true,
      enableImplicitConversion: implicit,
      groups: ["default"]
    }),
    {
      skipMissingProperties: true,
      forbidUnknownValues: true,
      stopAtFirstError: false,
      dismissDefaultMessages: true,
      validationError: { target: false, value: false }
    }
  );
  return parseValidationErrors(result);
}
