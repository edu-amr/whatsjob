import { ResponseMessage } from "../types";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

export async function menuResponse({ contactName, phoneNumber }: ResponseMessage): Promise<string[]> {
  const name = capitalizeFirstLetter(contactName);

  return [
    `${name ? `*${name}*, ` : ''}no que posso te ajudar 🤖?`,
    "*vagas*: lista de vagas. \r\n" +
      "*cancelar*: cancele o envio de vagas. \r\n" +
      "*cursos*: lista de cursos. \r\n" +
      "*sobre*: sobre o projeto. \r\n" +
      "*canais*: canais de tecnologia. \r\n" +
      "*projetos*: ideias de projetos. \r\n" +
      "*feedback*: formulário de feedback. \r\n" +
      "*doacao*: faça uma doação.",
  ];
}
