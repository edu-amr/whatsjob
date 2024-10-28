import { ResponseMessage } from "../types";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

export async function handleDefaultResponse({
  contactName,
  phoneNumber,
}: ResponseMessage): Promise<string[]> {
  const name = capitalizeFirstLetter(contactName);

  return [`${name ? `*${name}*, ` : ""}você deve digitar *menu* para usar o bot 😉.`];
}
