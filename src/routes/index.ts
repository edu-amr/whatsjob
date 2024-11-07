import { Router } from "express";
import { auth } from "../middlewares/auth";
import { RenderPages } from "../controllers/RenderPages";
import { MessagesController } from "../controllers/Messages";
import { JobsController } from "../controllers/Jobs";

const renderPages = new RenderPages();
const messagesController = new MessagesController();
const jobsController = new JobsController();

export const router = Router(); 

router.get("/", renderPages.home);
router.post("/send-message", auth, messagesController.sendMessage);
router.post('/post-job', auth, jobsController.postJob);
router.post("/send-jobs", auth, jobsController.sendJobsToSubscribers);
router.post("/delete-jobs", auth, jobsController.deleteJobsEveryFifteenDays);