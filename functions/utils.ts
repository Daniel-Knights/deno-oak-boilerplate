import { yellow, green, red } from 'https://deno.land/std@0.117.0/fmt/colors.ts';

export function log(...messages: string[]) {
  console.log(yellow(messages.join(' ')));
}

export function logSuccess(...messages: string[]) {
  console.log(green(messages.join(' ')));
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
