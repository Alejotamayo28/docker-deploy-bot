const validateId = new Set<number>();

export function checkValidateId(id: number, envAdminId: number): boolean {
  validateId.add(Number(envAdminId))
  return validateId.has(id);
}
