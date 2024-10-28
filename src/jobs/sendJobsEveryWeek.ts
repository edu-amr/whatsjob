import { CronJob } from "cron";
import { prisma } from "../services/prisma";
import { delay, WASocket } from '@whiskeysockets/baileys';
import { TIME_TO_SEND_JOBS } from "../config/constants";

async function sendJobs(socket: WASocket) {
  console.log("Enviando vagas...");

  try {
    const numbersData = await prisma.numero.findMany({
      select: {
        numero: true,
      },
    });

    if (numbersData.length === 0) {
      console.log("Nenhum número cadastrado para receber as vagas.");
      return;
    }

    const jobsData = await prisma.vaga.findMany({
      select: {
        titulo: true,
        link: true,
        modalidade: true,
      },
    });

    if (jobsData.length === 0) {
      console.log("Nenhuma vaga disponível no momento.");
      return;
    }

    let message = `Seguem as vagas disponíveis!`;

    jobsData.forEach((vaga) => {
      message +=
        `\r\n\r\n` +
        `🌎 Modalidade: ${vaga.modalidade}\r\n` +
        `📍 ${vaga.titulo}: ${vaga.link}`;
    });

    for (const entry of numbersData) {
      const number = entry.numero;
      try {
        await socket.sendMessage(number + "@s.whatsapp.net", { text: message });
        await delay(4000);
      } catch (sendError) {
        console.error(`Erro ao enviar mensagem para o número ${number}:`, sendError);
      }
    }
  } catch (error) {
    console.error("Erro ao enviar vagas:", error);
  }
}

export async function sendJobsEveryWeek(socket: WASocket) {
  const job = new CronJob(
    TIME_TO_SEND_JOBS,
    () => sendJobs(socket),
    null,
    true,
    "America/Los_Angeles"
  );

  job.start();
}
