import { WASocket, WAMessage, proto, delay } from "@whiskeysockets/baileys";
import { normalizeText } from "../utils/normalizeText";
import { menuResponse } from "../responses/menu";
import { subscribeResponse } from "../responses/subscribe";
import { aboutResponse } from "../responses/about";
import { feedbackResponse } from "../responses/feedback";
import { coursesResponse } from "../responses/courses";
import { jobsResponse } from "../responses/jobs";
import { donationResponse } from "../responses/donation";
import { channelsResponse } from "../responses/channels";
import { projectsResponse } from "../responses/projects";
import { unsubscribeResponse } from "../responses/unsubscribe";
import { postJobResponse } from "../responses/post-job";
import { handleDefaultResponse } from "../responses/default";
import { ResponseMessage } from "../types";
import { isNumberSubscribed } from '../utils/isNumberSubscribed'
import { normalizePhoneNumber } from "../utils/normalizePhoneNumber";

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

type DispatchFunction = (params: ResponseMessage) => Promise<string[]>;

const dispatchMap: Record<string, DispatchFunction> = {
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

async function getDispatchFunction(messageContent: string, phoneNumber: string): Promise<DispatchFunction | undefined> {
  const normalizedMessage = normalizeText(messageContent);
  const isSubscribed = await isNumberSubscribed(phoneNumber);

  if ((normalizedMessage.includes("cadastrar") || normalizedMessage.includes("lista")) && !isSubscribed) {
    return dispatchMap[MessageEnum.SUBSCRIBE];
  }

  if (normalizedMessage.includes("cancelar")) {
    if (isSubscribed) {
      return dispatchMap[MessageEnum.CANCEL];
    } else {
      return async () => [`Você não está cadastrado em nossa lista.`];
    }
  }

  return dispatchMap[normalizedMessage] || undefined;
}


export async function messageHandler(socket: WASocket, message: WAMessage) {
  const senderId = message.key.remoteJid;
  const rawPhoneNumber = senderId?.split("@")[0] as string;
  const phoneNumber = normalizePhoneNumber(rawPhoneNumber);
  const contactName = message.pushName as string;
  let messageContent = getMessageText(message);

  if (!message.key.fromMe && senderId && !senderId.endsWith("@g.us") && messageContent) {
    const dispatchFunction = await getDispatchFunction(messageContent, phoneNumber);
    let responseMessages: string[];

    if (dispatchFunction) {
      responseMessages = await dispatchFunction({ phoneNumber, contactName });
    } else {
      responseMessages = await handleDefaultResponse({ phoneNumber, contactName });
    }

    for (const responseMessage of responseMessages) {
      await socket.sendMessage(senderId as string, { text: responseMessage });
      await delay(1500);
    }
  } else if (!message.key.fromMe) {
    console.log("A mensagem não atende aos critérios:", {
      fromMe: message.key.fromMe,
      senderId,
      messageContent,
    });
  }
}
