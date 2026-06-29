export function getFieldError(
  field: any,
): string | undefined {
  if (!field.state.meta.isTouched || !field.state.meta.errors.length) {
    return undefined;
  }

  const error = field.state.meta.errors[0];

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }

  return String(error);
}
