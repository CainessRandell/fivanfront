const TRUTHY_VALUES = new Set(['1', 'true', 'yes', 'on']);
const REDACTED_FIELDS = new Set(['senha', 'password', 'token', 'authorization']);

const rawDebug = String(
  typeof __LOG_DEBUG__ !== 'undefined' ? __LOG_DEBUG__ : import.meta.env.VITE_LOG_DEBUG ?? 'false'
).toLowerCase();

export const LOG_DEBUG_ENABLED = TRUTHY_VALUES.has(rawDebug);

export function sanitizeForLog(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForLog(item));
  }

  if (typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (REDACTED_FIELDS.has(key.toLowerCase())) {
        return [key, '[REDACTED]'];
      }

      return [key, sanitizeForLog(item)];
    })
  );
}

export function debugLog(scope, message, details) {
  if (!LOG_DEBUG_ENABLED) {
    return;
  }

  if (details === undefined) {
    console.log(`[DEBUG][${scope}] ${message}`);
    return;
  }

  console.log(`[DEBUG][${scope}] ${message}`, sanitizeForLog(details));
}

export function debugError(scope, message, details) {
  if (!LOG_DEBUG_ENABLED) {
    return;
  }

  if (details === undefined) {
    console.error(`[DEBUG][${scope}] ${message}`);
    return;
  }

  console.error(`[DEBUG][${scope}] ${message}`, sanitizeForLog(details));
}