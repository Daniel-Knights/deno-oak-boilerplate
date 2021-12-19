export function generateCryptoKey() {
  return crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-512' }, true, [
    'sign',
    'verify',
  ]);
}
