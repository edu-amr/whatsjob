import { prisma } from "../services/prisma";

export async function isNumberSubscribed(phoneNumber: string): Promise<boolean> {
  try {
    const existingNumber = await prisma.numero.findUnique({
      where: { numero: phoneNumber },
    });
    return !!existingNumber;
  } catch (error) {
    console.error("Erro ao verificar a inscrição do número:", error);
    return false;
  }
}
