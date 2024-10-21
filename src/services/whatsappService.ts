import { Boom } from '@hapi/boom';
import makeWASocket, { DisconnectReason, useMultiFileAuthState, WAMessage, WASocket } from '@whiskeysockets/baileys';

let socket: WASocket | null = null;
let isSocketConnected = false;

async function connectToWhatsApp(handleIncomingMessage: (socket: WASocket, message: WAMessage) => Promise<void>) {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

  socket = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });
  
  socket.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      isSocketConnected = false;
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log('Conexão fechada. Reconectando em 5 segundos...');
        setTimeout(() => connectToWhatsApp(handleIncomingMessage), 5000);
      } else {
        console.log('Conexão fechada. Não será reconectado.');
      }
    } else if (connection === 'open') {
      isSocketConnected = true;
      console.log('Conexão aberta');
    }
  });

  socket.ev.on('creds.update', saveCreds);

  socket.ev.on('messages.upsert', async (messageUpdate) => {
    if (socket) {
      const message = messageUpdate.messages[0];
      if (!message.key.fromMe) { // Apenas processa mensagens recebidas
        await handleIncomingMessage(socket, message);
      }
    }
  });
}

function whatsappSocket(): WASocket {
  if (!socket) {
    throw new Error('WhatsApp socket is not initialized');
  }
  return socket;
}

function isConnected(): boolean {
  return isSocketConnected;
}

export { connectToWhatsApp, whatsappSocket, isConnected };
