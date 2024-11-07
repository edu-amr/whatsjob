import path from "path";
import express from "express";
import { router } from "./routes";;
import { connectToWhatsApp } from "./services/whatsapp";
import errorMiddleware from "./middlewares/error";
import 'express-async-errors';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const server = express()
    .use(express.json())
    .use(router)
    .use(express.static(path.resolve(__dirname, "..", "public")))
    .use(errorMiddleware);

  await connectToWhatsApp();

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

bootstrap();
