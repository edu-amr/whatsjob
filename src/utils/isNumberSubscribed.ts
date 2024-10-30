import { prisma } from "../services/prisma";

export async function isNumberSubscribed(phoneNumber: string): Promise<boolean> {
  try {
    console.log("Verificando inscrição para o número:", phoneNumber);
    const existingNumber = await prisma.numero.findUnique({
      where: { numero: phoneNumber },
    });
    console.log("Resultado da consulta:", existingNumber);
    return !!existingNumber;
  } catch (error) {
    console.error("Erro ao verificar a inscrição do número:", error);
    return false;
  }
}
