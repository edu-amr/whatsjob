import { Router } from "express";
import { RenderPages } from "../controllers/RenderPages";
import { MessagesController } from "../controllers/Messages";
import { auth } from "../middlewares/auth";

const renderPages = new RenderPages();
const messagesController = new MessagesController();

export const router = Router(); 

router.get("/", renderPages.home);
router.post("/send-message", auth, messagesController.sendMessage);
