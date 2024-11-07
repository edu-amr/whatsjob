import { Boom } from '@hapi/boom';
import makeWASocket, { DisconnectReason, useMultiFileAuthState, WASocket } from '@whiskeysockets/baileys';
import { messageHandler } from '../handlers/messageHandler';

export let whatsAppSocket: WASocket;
export let isSocketConnected = false;

export async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  
  let socket = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });

  whatsAppSocket = socket
  
  socket.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      isSocketConnected = false;
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log('Conexão fechada. Reconectando em 5 segundos...');
        setTimeout(() => connectToWhatsApp(), 5000);
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
      if (!message.key.fromMe) {
        await messageHandler(socket, message);
      }
    }
  });
}