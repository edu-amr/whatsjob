import { WASocket, WAMessage, proto } from "@whiskeysockets/baileys";
import { menuResponse } from "./bot-responses/menu";
import { subscribeResponse } from "./bot-responses/subscribe";
import { aboutResponse } from "./bot-responses/about";
import { feedbackResponse } from "./bot-responses/feedback";
import { coursesResponse } from "./bot-responses/courses";
import { jobsResponse } from "./bot-responses/jobs";
import { donationResponse } from "./bot-responses/donation";
import { channelsResponse } from "./bot-responses/channels";
import { projectsResponse } from "./bot-responses/projects";
import { unsubscribeResponse } from "./bot-responses/cancel";
import { handleDefaultResponse } from "./bot-responses/default";
import { delay } from "../utils/delay";
import { postJobResponse } from "./bot-responses/post-job";

export enum MessageEnum {
  SUBSCRIBE = "ola, gostaria de me cadastrar na lista para receber as vagas!",
  JOBS = "vagas",
  CANCEL = "cancelar",
  COURSES = "cursos",
  ABOUT = "sobre",
  PROJECTS = "projetos",
  FEEDBACK = "feedback",
  DONATION = "doacao",
  CHANNELS = "canais",
  POST_JOB = "postar",
  MENU = "menu",
}

const dispatchMap: Record<
  string,
  (phoneNumber: string, contactName: string) => Promise<string[]>
> = {
  [MessageEnum.MENU]: menuResponse,
  [MessageEnum.SUBSCRIBE]: subscribeResponse,
  [MessageEnum.CANCEL]: unsubscribeResponse,
  [MessageEnum.JOBS]: jobsResponse,
  [MessageEnum.ABOUT]: aboutResponse,
  [MessageEnum.FEEDBACK]: feedbackResponse,
  [MessageEnum.COURSES]: coursesResponse,
  [MessageEnum.PROJECTS]: projectsResponse,
  [MessageEnum.DONATION]: donationResponse,
  [MessageEnum.CHANNELS]: channelsResponse,
  [MessageEnum.POST_JOB]: postJobResponse,
};

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function getMessageText(message: WAMessage): string | undefined {
  const msg = message.message;

  if (!msg) return undefined;

  const messageType = Object.keys(msg)[0] as keyof proto.IMessage;

  switch (messageType) {
    case "conversation":
      return msg.conversation ?? undefined;
    case "extendedTextMessage":
      return msg.extendedTextMessage?.text ?? undefined;
    case "imageMessage":
      return msg.imageMessage?.caption ?? undefined;
    case "videoMessage":
      return msg.videoMessage?.caption ?? undefined;
    case "documentMessage":
      return msg.documentMessage?.caption ?? undefined;
    case "templateButtonReplyMessage":
      return msg.templateButtonReplyMessage?.selectedDisplayText ?? undefined;
    case "buttonsResponseMessage":
      return msg.buttonsResponseMessage?.selectedButtonId ?? undefined;
    default:
      return undefined;
  }
}

export async function handleIncomingMessage(socket: WASocket, message: WAMessage) {
  const senderId = message.key.remoteJid;
  const phoneNumber = senderId?.split("@")[0] as string;
  const contactName = message.pushName as string;
  let messageContent = getMessageText(message);

  if (!message.key.fromMe && senderId && !senderId.endsWith("@g.us") && messageContent) {
    messageContent = normalizeText(messageContent);

    const dispatchFunction = dispatchMap[messageContent];
    let responseMessages: string[];

    if (dispatchFunction) {
      responseMessages = await dispatchFunction(phoneNumber, contactName);
    } else {
      responseMessages = await handleDefaultResponse(phoneNumber, contactName);
    }

    for (const responseMessage of responseMessages) {
      await socket.sendMessage(senderId as string, { text: responseMessage });
      await delay(1500);
    }
  }  else if (!message.key.fromMe) {
    console.log("A mensagem não atende aos critérios:", {
      fromMe: message.key.fromMe,
      senderId,
      messageContent,
    });
  }
}
