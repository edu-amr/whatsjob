export async function handleDefaultResponse(
  phoneNumber: string,
  contactName: string
): Promise<string[]> {
  const name = contactName || 'Amigo';

  return [
    `*${name}*, você deve digitar *menu* para usar o bot 😉.`
  ];
}
