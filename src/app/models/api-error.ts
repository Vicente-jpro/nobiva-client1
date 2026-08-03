import { HttpErrorResponse } from '@angular/common/http';

const INTERNAL_DETAIL_PATTERN =
  /(jdbc|sqlstate|hibernate|entitymanager|relation\s+["']?|select\s+.+\s+from|insert\s+into|update\s+.+\s+set|delete\s+from|stack trace|exception at)/i;

export function publicApiErrors(
  error: HttpErrorResponse,
  fallback = 'Ocorreu um erro. Por favor, tente novamente.'
): string[] {
  if (error.status === 0 || error.status >= 500) {
    return ['Serviço temporariamente indisponível. Tente novamente mais tarde.'];
  }

  const payload = error.error?.errors;
  const candidates = Array.isArray(payload) ? payload : [payload];
  const safeMessages = candidates.filter(
    (message): message is string =>
      typeof message === 'string' &&
      message.trim().length > 0 &&
      !INTERNAL_DETAIL_PATTERN.test(message)
  );

  return safeMessages.length > 0 ? safeMessages : [fallback];
}
