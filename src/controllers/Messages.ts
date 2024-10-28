import { NextFunction, Request, Response } from 'express';
import { isSocketConnected, whatsAppSocket } from '../services/whatsapp';

export class MessagesController {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    const { number, message, error } = req.body;

    if (!number || !message) {
      return res.status(400).json({ error: 'Número e mensagem são obrigatórios.' });
    }

    if (!/^\d+$/.test(number)) {
      return res.status(400).json({ error: 'Número de telefone inválido.' });
    }

    if (!isSocketConnected) {
      return res.status(500).json({ error: 'WhatsApp não está conectado.' });
    }

    try {
      await whatsAppSocket.sendMessage(`${number}@s.whatsapp.net`, { text: message });
      res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso.' });
    } catch (err) {
      next(err);
    }
  }
}
