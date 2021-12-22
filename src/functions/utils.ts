import { yellow, green, red } from 'https://deno.land/std@0.117.0/fmt/colors.ts';
import { Collection, Filter } from '../config/deps.ts';

function formatLogMessage(messages: unknown[]) {
  return messages
    .map((msg: unknown) => (typeof msg === 'string' ? msg : JSON.stringify(msg)))
    .join(' ');
}

export function log(...messages: unknown[]) {
  console.log(yellow(formatLogMessage(messages)));
}

export function logSuccess(...messages: unknown[]) {
  console.log(green(formatLogMessage(messages)));
}

export function logErr(...errors: Error[]) {
  errors.forEach((err) => console.error(red(err.stack || '')));
}

export function generateCryptoKey() {
  return crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-512' }, true, [
    'sign',
    'verify',
  ]);
}

export function hasFalsyProperties(fields: Record<string, unknown>) {
  return Object.values(fields).some((field) => !field);
}

export function find<T>(collection: Collection<T>, filter?: Filter<T>) {
  return collection.find(filter, { noCursorTimeout: false });
}
export function findOne<T>(collection: Collection<T>, filter?: Filter<T>) {
  return collection.findOne(filter, { noCursorTimeout: false });
}
