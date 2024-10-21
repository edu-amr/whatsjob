import path from 'path';
import express from 'express';
import { router } from './routes';
import { PORT } from './config/constants';
import { initSendJobsEveryWeek } from './jobs/send-jobs-every-week';
import { handleIncomingMessage } from './handlers/messageIncomingMessage';
import { connectToWhatsApp } from './services/whatsappService';

async function bootstrap() {
  const server = express()
    .use(express.json())
    .use(router)
    .use(express.static(path.resolve(__dirname, "..", "public")));

  await connectToWhatsApp(handleIncomingMessage);
  await initSendJobsEveryWeek();

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

bootstrap();
