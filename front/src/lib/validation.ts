export class InputValidationError extends Error {}

export function readRequiredString(
  formData: FormData,
  field: string,
  label: string,
  maxLength: number,
) {
  const value = formData.get(field);
  if (typeof value !== "string" || !value.trim()) {
    throw new InputValidationError(`${label} est requis.`);
  }

  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new InputValidationError(`${label} est trop long.`);
  }
  return trimmed;
}

export function readOptionalString(
  formData: FormData,
  field: string,
  label: string,
  maxLength: number,
) {
  const value = formData.get(field);
  if (value === null || value === "") return "";
  if (typeof value !== "string") {
    throw new InputValidationError(`${label} est invalide.`);
  }

  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new InputValidationError(`${label} est trop long.`);
  }
  return trimmed;
}

export function assertEmail(email: string) {
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new InputValidationError("L’adresse email est invalide.");
  }
}

export function assertPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (phone && (!/^[+()\d\s.-]+$/.test(phone) || digits.length < 8 || digits.length > 20)) {
    throw new InputValidationError("Le numéro de téléphone est invalide.");
  }
}

export function assertIdentifier(value: string, label = "Identifiant") {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(value)) {
    throw new InputValidationError(`${label} est invalide.`);
  }
  return value;
}

export function readNonNegativeNumber(formData: FormData, field: string, label: string) {
  const raw = formData.get(field);
  if (raw === null || raw === "") return 0;
  if (typeof raw !== "string") {
    throw new InputValidationError(`${label} est invalide.`);
  }

  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0 || value > 1_000_000_000) {
    throw new InputValidationError(`${label} doit être un nombre positif valide.`);
  }
  return value;
}

export function isValidationError(error: unknown): error is InputValidationError {
  return error instanceof InputValidationError;
}
