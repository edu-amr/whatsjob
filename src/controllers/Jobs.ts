import { Request, Response } from 'express';
import { whatsAppSocket } from '../services/whatsapp';
import { prisma } from '../services/prisma';
import { delay } from '@whiskeysockets/baileys';

export class JobsController {
  async sendJobsToSubscribers(req: Request, res: Response) {
    console.log("Enviando vagas...");

    try {
      const numbersData = await prisma.numero.findMany({
        select: {
          numero: true,
        },
      });
  
      if (numbersData.length === 0) {
        console.log("Nenhum número cadastrado para receber as vagas.");
        return res.status(200).json({ message: "Nenhum número cadastrado para receber as vagas." });
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
        return res.status(200).json({ message: "Nenhuma vaga disponível no momento." });
      }
  
      let message = `Seguem as vagas disponíveis dessa semana 😄.`;
  
      jobsData.forEach((vaga) => {
        message +=
          `\r\n\r\n` +
          `📍 ${vaga.titulo}\r\n` +
          `🌎 ${vaga.modalidade}\r\n` +
          `🔗 ${vaga.link}`
      });
  
      for (const entry of numbersData) {
        const number = entry.numero;
        try {
          await whatsAppSocket.sendMessage(number + "@s.whatsapp.net", { text: message });
          await delay(4000);
        } catch (sendError) {
          console.error(`Erro ao enviar mensagem para o número ${number}:`, sendError);
        }
      }
  
      res.status(200).json({ message: "Vagas enviadas com sucesso para todos os números cadastrados." });
    } catch (error) {
      console.error("Erro ao enviar vagas:", error);
      res.status(500).json({ error: "Erro ao enviar vagas." });
    }
  }

  async deleteJobsEveryFifteenDays(req: Request, res: Response) {
    try {
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
  
      const deletedJobs = await prisma.vaga.deleteMany({
        where: {
          created_at: {
            lt: fifteenDaysAgo,
          },
        },
      });
  
      res.status(200).json({
        message: `${deletedJobs.count} vagas com mais de 15 dias foram deletadas.`,
      });
    } catch (error) {
      console.error("Erro ao deletar vagas antigas:", error);
      res.status(500).json({ error: "Erro ao deletar vagas antigas." });
    }
  }

  async postJob(req: Request, res: Response) {
    const { titulo, modalidade, link } = req.body;

    if (!titulo || !modalidade || !link) {
      return res.status(400).json({ error: "Título, modalidade e link são obrigatórios." });
    }

    try {
      const newJob = await prisma.vaga.create({
        data: {
          titulo,
          modalidade,
          link,
        },
      });

      res.status(201).json({ message: "Vaga criada com sucesso.", job: newJob });
    } catch (error) {
      console.error("Erro ao criar vaga:", error);
      res.status(500).json({ error: "Erro ao criar vaga." });
    }
  }
}
