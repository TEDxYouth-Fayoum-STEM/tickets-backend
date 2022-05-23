import { Expose } from "class-transformer";
import { Allow, IsDefined } from "class-validator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DecoratorFunction = (...args: any[]) => PropertyDecorator;

export default function constraint(
  allowedAt: string | string[] | null,
  requiredAt?: string | string[] | boolean,
  decorators?: DecoratorFunction | DecoratorFunction[],
  params?: unknown | unknown[]
): PropertyDecorator {
  // returned property decorator
  return function (target: unknown, propertyKey: string | symbol): void {
    // adjusting arguments
    if (allowedAt === null) allowedAt = ["default"];
    else if (!Array.isArray(allowedAt)) allowedAt = [allowedAt];
    if (requiredAt !== undefined) {
      if (requiredAt === true) {
        requiredAt = allowedAt;
      } else if (typeof requiredAt === "string") {
        allowedAt.push(requiredAt);
        requiredAt = [requiredAt];
      } else if (Array.isArray(requiredAt)) {
        allowedAt.push(...requiredAt);
      }
    }
    // decorator options
    const options = { groups: allowedAt };
    if (decorators) {
      if (!Array.isArray(decorators)) decorators = [decorators];
      if (params === undefined) params = [];
      else if (decorators.length === 1 || !Array.isArray(params))
        params = [params];
      for (const decorator in decorators) {
        const currentParams = (params as unknown[])[decorator];
        const decoratorParams = Array.isArray(currentParams)
          ? [...currentParams, options]
          : currentParams !== undefined
          ? [currentParams, options]
          : [options];
        decorators[decorator](...decoratorParams)(
          target as Record<string, unknown>,
          propertyKey
        );
      }
    }
    Allow({ groups: allowedAt })(
      target as Record<string, unknown>,
      propertyKey
    );
    if (requiredAt) {
      IsDefined({ groups: requiredAt })(
        target as Record<string, unknown>,
        propertyKey
      );
    }
    Expose({ groups: allowedAt });
  };
}
