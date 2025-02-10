import { config } from "../config/env.config";

const validateId = new Set<number>();
validateId.add(Number(config.ADMIN_ID!));

export function checkValidateId(id: number): boolean {
  return validateId.has(id);
}
