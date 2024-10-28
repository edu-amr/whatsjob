import path from "path";
import express, { Request, Response, NextFunction } from "express";
import { router } from "./routes";
import { PORT } from "./config/constants";
import { connectToWhatsApp } from "./services/whatsapp";
import { sendEmail } from "./services/mailer";
import 'express-async-errors';

async function bootstrap() {
  const server = express()
    .use(express.json())
    .use(router)
    .use(express.static(path.resolve(__dirname, "..", "public")))
    .use((err: Error, req: Request, res: Response, next: NextFunction) => {
      sendEmail(process.env.EMAIL_TO!, "Erro na Aplicação", `Erro detectado: ${err.message || err}`);
      res.status(500).send("Erro no servidor");
    });

  await connectToWhatsApp();

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

bootstrap();
