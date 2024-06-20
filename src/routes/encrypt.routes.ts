// routes/decryptLink.ts
import { Router, Request, Response } from 'express';
import { decryptLink } from '../utils/encryption';

const routerLink = Router();

routerLink.post('/decrypt-link', (req: Request, res: Response) => {
  try {
    const { encryptedLink, secretKey, iv } = req.body;

    // Verifica que se proporcionen todos los datos necesarios
    if (!encryptedLink || !secretKey || !iv) {
      throw new Error('Faltan datos obligatorios para desencriptar el enlace');
    }

    // Desencripta el enlace utilizando la clave secreta y el IV proporcionados
    const decryptedLink = decryptLink(encryptedLink, secretKey, iv);

    // Devuelve el enlace desencriptado al frontend
    res.json({ decryptedLink });
  } catch (error: any) {
    console.error('Error al desencriptar el enlace:', error);
    res.status(500).json({ error: 'Error interno al desencriptar el enlace', errorMessage: error.message });
  }
});

export default routerLink;