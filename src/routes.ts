import { Router } from "express";
import { RenderPages } from "./controllers/RenderPages";
import { MessagesController } from "./controllers/MessagesController";
import { basicAuthMiddleware } from "middlewares/basicAuthMiddleware";

const renderPages = new RenderPages();
const messagesController = new MessagesController();

export const router = Router();

router.get("/", renderPages.home);
router.post("/send-message", basicAuthMiddleware, messagesController.sendMessage);
