import CryptoJS from 'crypto-js';

const CHAVE = 'POABWE9YM&9RVQ31';

export function criptografar(texto: string): string {
  if (!texto) return '';

  const encrypted = CryptoJS.AES.encrypt(texto, CryptoJS.enc.Utf8.parse(CHAVE), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
}
