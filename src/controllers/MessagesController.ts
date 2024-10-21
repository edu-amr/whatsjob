import { Request, Response } from 'express';
import { whatsappSocket, isConnected } from '../services/whatsappService';

export class MessagesController {
  sendMessage = async (req: Request, res: Response) => {
    const { number, message } = req.body;

    if (!number || !message) {
      return res.status(400).json({ error: 'Número e mensagem são obrigatórios.' });
    }

    if (!/^\d+$/.test(number)) {
      return res.status(400).json({ error: 'Número de telefone inválido.' });
    }

    if (!isConnected()) {
      return res.status(500).json({ error: 'WhatsApp não está conectado.' });
    }

    try {
      const socket = whatsappSocket();
      await socket.sendMessage(`${number}@s.whatsapp.net`, { text: message });
      res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso.' });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      res.status(500).json({ error: 'Erro ao enviar mensagem.' });
    }
  };
}
