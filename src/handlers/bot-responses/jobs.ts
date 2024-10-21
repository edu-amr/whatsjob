import { JOBS_TABLE } from "../../config/constants";
import { supabaseService } from "../../services/supabaseService";

export async function jobsResponse(phoneNumber: string, contactName: string): Promise<string[]> {
  const name = contactName || "Amigo";

  const { data, error } = await supabaseService
    .from(JOBS_TABLE)
    .select("titulo, link, modalidade");

  if (error) {
    return [
      `Desculpe, *${name}*. Tivemos um problema ao buscar as vagas. Por favor, tente novamente mais tarde.`,
    ];
  }

  if (data.length === 0) {
    return [`*${name}*. Atualmente, não temos vagas disponíveis.`];
  }

  let message = `Essas são as vagas disponíveis:`;

  data.forEach((vaga: any) => {
    message +=
      `\r\n\r\n` + `🌎 Modalidade: ${vaga.modalidade}\r\n` + `📍 ${vaga.titulo}: ${vaga.link}`;
  });

  return [message];
}
