import { SUBSCRIBE_TABLE } from "../../config/constants";
import { supabaseService } from "../../services/supabaseService";

export async function unsubscribeResponse(phoneNumber: string, contactName: string) {
  const name = contactName || "Amigo";
  await supabaseService.from(SUBSCRIBE_TABLE).delete().eq("numero", phoneNumber);
  return [`*${name}*, removemos você da nossa lista de envio de vagas automáticas 😁.`];
}
