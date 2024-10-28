import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { prisma } from "../services/prisma";
import { ResponseMessage } from "../types";

export async function jobsResponse({
  contactName,
  phoneNumber,
}: ResponseMessage): Promise<string[]> {
  const name = capitalizeFirstLetter(contactName);

  try {
    const vagas = await prisma.vaga.findMany({
      select: {
        titulo: true,
        link: true,
        modalidade: true,
      },
    });

    if (vagas.length === 0) {
      return [
        `${name ? `*${name}*. ` : ""}Atualmente, não temos vagas disponíveis.`,
      ];
    }

    let message = `${name ? `*${name}*, ` : ""}essas são as vagas disponíveis:`;

    vagas.forEach((vaga) => {
      message +=
        `\r\n\r\n` +
        `🌎 Modalidade: ${vaga.modalidade}\r\n` +
        `📍 ${vaga.titulo}: ${vaga.link}`;
    });

    return [message];
  } catch (error) {
    console.error('Erro ao buscar as vagas:', error);
    return [
      `Desculpe, ${name ? `*${name}*. ` : ""}Tivemos um problema ao buscar as vagas. Por favor, tente novamente mais tarde.`,
    ];
  }
}
