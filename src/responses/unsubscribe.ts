import { ResponseMessage } from "../types";
import { prisma } from "../services/prisma";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

export async function unsubscribeResponse({ phoneNumber, contactName }: ResponseMessage) {
  const name = capitalizeFirstLetter(contactName);

  try {
    await prisma.numero.delete({
      where: {
        numero: phoneNumber,
      },
    });

    return [
      `${name ? `*${name}*, ` : ''}removemos você da nossa lista de envio de vagas automáticas 😁.`
    ];
  } catch (error) {
    console.error('Erro ao remover da lista:', error);
    return [
      `Desculpe, ${name ? `*${name}*. ` : ''}Tivemos um problema ao remover você da lista. Por favor, tente novamente mais tarde 😕.`
    ];
  }
}
