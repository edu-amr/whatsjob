export async function donationResponse(): Promise<string[]> {
  return [
    `Agradecemos por considerar fazer uma doação para apoiar nosso projeto 😀.\r\n\r\n` +
      `Você pode fazer uma doação de duas formas:\r\n\r\n` +
      `🔗 Doação direta: https://buy.stripe.com/eVa9CEd423lHamAcMM \r\n\r\n` +
      `🔑 Chave Pix: eduardo.amaro164@gmail.com \r\n\r\n` +
      `Obrigado pelo seu apoio!`,
  ];
}
