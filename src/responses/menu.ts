import { ResponseMessage } from "../types";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { isNumberSubscribed } from '../utils/isNumberSubscribed';

export async function menuResponse({ contactName, phoneNumber }: ResponseMessage): Promise<string[]> {
  const name = capitalizeFirstLetter(contactName);
  const isSubscribed = await isNumberSubscribed(phoneNumber);

  let menuOptions = "*vagas*: lista de vagas.\r\n";

  if (isSubscribed) {
    menuOptions += "*cancelar*: cancele o envio de vagas.\r\n";
  } else {
    menuOptions += "*cadastrar*: cadastre-se para receber as vagas.\r\n";
  }

  menuOptions +=
    "*cursos*: lista de cursos.\r\n" +
    "*sobre*: sobre o projeto.\r\n" +
    "*canais*: canais de tecnologia.\r\n" +
    "*projetos*: ideias de projetos.\r\n" +
    "*feedback*: formulário de feedback.\r\n" +
    "*postar*: postar uma vaga.\r\n" +
    "*doacao*: faça uma doação.";

  return [
    `${name ? `*${name}*, ` : ''}no que posso te ajudar 🤖?`,
    menuOptions,
  ];
}
