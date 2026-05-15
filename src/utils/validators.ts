/**
 * Validadores reutilizables para formularios de Lumera.
 * Cada función retorna un string de error o null si es válido.
 */

/** Valida que un campo no esté vacío */
export const required = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} es obligatorio.`;
  }
  return null;
};

/** Valida que un nombre sea válido (solo letras, espacios y tildes) */
export const validName = (value: string, fieldName: string): string | null => {
  const req = required(value, fieldName);
  if (req) return req;
  
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.]+$/.test(value.trim())) {
    return `${fieldName} solo debe contener letras.`;
  }
  if (value.trim().length < 3) {
    return `${fieldName} debe tener al menos 3 caracteres.`;
  }
  return null;
};

/** Valida un email con formato estándar */
export const validEmail = (value: string): string | null => {
  const req = required(value, 'El correo electrónico');
  if (req) return req;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) {
    return 'El formato del correo electrónico no es válido.';
  }
  return null;
};

/** Valida una contraseña (mínimo 6 caracteres) */
export const validPassword = (value: string): string | null => {
  const req = required(value, 'La contraseña');
  if (req) return req;

  if (value.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  return null;
};

/** Valida que dos contraseñas coincidan */
export const passwordsMatch = (password: string, confirm: string): string | null => {
  if (password !== confirm) {
    return 'Las contraseñas no coinciden.';
  }
  return null;
};

/** Valida que la nueva contraseña sea diferente a la actual */
export const differentPassword = (newPassword: string, currentPassword: string): string | null => {
  if (newPassword === currentPassword) {
    return 'La nueva contraseña debe ser diferente a la actual.';
  }
  return null;
};

/** Valida un número de cédula colombiana (6-10 dígitos) */
export const validDocumentId = (value: string, fieldName: string): string | null => {
  const req = required(value, fieldName);
  if (req) return req;

  const clean = value.replace(/[.\s-]/g, '');
  if (!/^\d+$/.test(clean)) {
    return `${fieldName} debe contener solo números.`;
  }
  if (clean.length < 6 || clean.length > 10) {
    return `${fieldName} debe tener entre 6 y 10 dígitos.`;
  }
  return null;
};

/** Valida un teléfono colombiano (7-10 dígitos, puede incluir +57) */
export const validPhone = (value: string): string | null => {
  const req = required(value, 'El teléfono');
  if (req) return req;

  const clean = value.replace(/[\s+\-()]/g, '');
  if (clean.startsWith('57')) {
    if (clean.length < 10 || clean.length > 12) {
      return 'El teléfono debe tener entre 10 y 12 dígitos (incluyendo 57).';
    }
  } else if (clean.length < 7 || clean.length > 10) {
    return 'El teléfono debe tener entre 7 y 10 dígitos.';
  }
  if (!/^\d+$/.test(clean)) {
    return 'El teléfono debe contener solo números.';
  }
  return null;
};

/** Valida que una dirección tenga contenido mínimo */
export const validAddress = (value: string): string | null => {
  const req = required(value, 'La dirección');
  if (req) return req;

  if (value.trim().length < 5) {
    return 'La dirección debe tener al menos 5 caracteres.';
  }
  return null;
};

/**
 * Valida un formulario completo contra un esquema de validación.
 * Retorna un objeto con errores por campo.
 *
 * @example
 * const errors = validateForm({
 *   fullName: () => validName(form.fullName, 'El nombre'),
 *   email: () => validEmail(form.email),
 * });
 * if (errors.fullName) setError('fullName', errors.fullName);
 */
export const validateForm = <T extends Record<string, () => string | null>>(
  validators: T
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};
  
  for (const [field, validator] of Object.entries(validators)) {
    const error = (validator as () => string | null)();
    if (error) {
      errors[field as keyof T] = error;
    }
  }
  
  return errors;
};

/** Verifica si un objeto de errores no tiene errores */
export const hasNoErrors = (errors: Record<string, string | null>): boolean => {
  return Object.values(errors).every((v) => v === null);
};
