import { prisma } from "../services/prisma";
import { ResponseMessage } from "../types";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

export async function subscribeResponse({ contactName, phoneNumber }: ResponseMessage): Promise<string[]> {
  const name = capitalizeFirstLetter(contactName);
  
  try {
    const existingEntry = await prisma.numero.findUnique({
      where: {
        numero: phoneNumber,
      },
    });

    if (existingEntry) {
      return [
        `${name ? `*${name}*, ` : ''}você já está inscrito na nossa lista para receber as vagas 😁!`
      ];
    }

    await prisma.numero.create({
      data: {
        numero: phoneNumber,
      },
    });

    return [
      `${name ? `*${name}*, ` : ''}inscrevi você na nossa lista para receber as vagas 🎉! Você também pode digitar *menu* para usar o bot 🤖.`
    ];
  } catch (error) {
    console.error('Erro ao processar inscrição:', error);
    return [
      `Desculpe, ${name ? `*${name}*. ` : ''}Tivemos um problema ao processar sua inscrição. Por favor, tente novamente mais tarde 😕.`
    ];
  }
}
