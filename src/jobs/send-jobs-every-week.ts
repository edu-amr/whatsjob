import { CronJob } from "cron";
import { JOBS_TABLE, SUBSCRIBE_TABLE, TIME_TO_SEND_JOBS } from "../config/constants";
import { supabaseService } from "../services/supabaseService";
import { delay } from "../utils/delay";
import { whatsappSocket, isConnected } from "../services/whatsappService";

async function sendBroadcastMessage() {
  if (!isConnected()) {
    console.error('Socket não está conectado. Mensagens não serão enviadas.');
    return;
  }

  const socket = whatsappSocket();

  const { data: numbersData, error: numbersError } = await supabaseService
    .from(SUBSCRIBE_TABLE)
    .select("numero");

  if (numbersError) {
    console.error("Erro ao buscar números do banco de dados:", numbersError);
    return;
  }

  const { data: jobsData, error: jobsError } = await supabaseService
    .from(JOBS_TABLE)
    .select("titulo, link, modalidade");

  if (jobsError) {
    console.error("Erro ao buscar vagas do banco de dados:", jobsError);
    return;
  }

  if (!jobsData || jobsData.length === 0) {
    console.log("Nenhuma vaga disponível no momento.");
    return;
  }

  let message = `Seguem as vagas!`;

  jobsData.forEach((vaga: any) => {
    message +=
      `\r\n\r\n` + `🌎 Modalidade: ${vaga.modalidade}\r\n` + `📍 ${vaga.titulo}: ${vaga.link}`;
  });

  for (const entry of numbersData) {
    const number = entry.numero;
    try {
      await socket.sendMessage(number + "@s.whatsapp.net", { text: message });
      await delay(4000); // Use 'await' para garantir o atraso
    } catch (sendError) {
      console.error(`Erro ao enviar mensagem para o número ${number}:`, sendError);
    }
  }
}

export async function initSendJobsEveryWeek() {
  const job = new CronJob(
    TIME_TO_SEND_JOBS,
    () => sendBroadcastMessage(),
    null,
    true,
    "America/Los_Angeles"
  );

  job.start();
}
