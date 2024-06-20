import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// Función para cifrar el enlace
export function encryptLink(link: string, secretKey: Buffer, iv: Buffer): { encryptedLink: string, secretKey: string, iv: string } {
  const cipher = createCipheriv('aes-256-cbc', secretKey, iv);
  let encryptedLink = cipher.update(link, 'utf8', 'hex');
  encryptedLink += cipher.final('hex');
  return {
    encryptedLink,
    secretKey: secretKey.toString('base64'), // Convertir Buffer a base64 para enviarlo
    iv: iv.toString('base64') // Convertir Buffer a base64 para enviarlo
  };
}

// Función para descifrar el enlace
export function decryptLink(encryptedLink: string, secretKey: Buffer, iv: Buffer): string {
  const decipher = createDecipheriv('aes-256-cbc', secretKey, iv);
  let decryptedLink = decipher.update(encryptedLink, 'hex', 'utf8');
  decryptedLink += decipher.final('utf8');
  return decryptedLink;
}

// Función para generar una clave secreta aleatoria
export function generateSecretKey(): Buffer {
  return randomBytes(32); // 32 bytes para la clave AES-256
}

// Función para generar un vector de inicialización (IV) aleatorio
export function generateIV(): Buffer {
  return randomBytes(16); // 16 bytes para el IV
}
