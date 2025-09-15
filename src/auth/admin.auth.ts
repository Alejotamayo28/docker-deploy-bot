const validateId = new Set<number>();

//Validated users Telegrams users
export function checkValidateId(id: number, envAdminId: number): boolean {
  validateId.add(Number(envAdminId))
  return validateId.has(id);
}
