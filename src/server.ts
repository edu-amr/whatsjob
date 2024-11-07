import path from "path";
import express from "express";
import { router } from "./routes";
import { connectToWhatsApp } from "./services/whatsapp";
import errorMiddleware from "./middlewares/error";
import "express-async-errors";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const server = express()
    .use(express.json())
    .use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "https://whatsjob.com.br");
      res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Time-Zone");
      res.header("Access-Control-Allow-Credentials", "true");
      next();
    })
    .use(router)
    .use(express.static(path.resolve(__dirname, "..", "public")))
    .use(errorMiddleware);

  await connectToWhatsApp();

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

bootstrap();
