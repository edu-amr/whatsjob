export const SUBSCRIBE_TABLE = process.env.ENVIRONMENT == "dev" ? "Numero" : "Numero";
export const JOBS_TABLE = process.env.ENVIRONMENT == "dev" ? "Vaga" : "Vaga";
export const TIME_TO_SEND_JOBS = process.env.ENVIRONMENT == "dev" ? "*/60 * * * * *" : "0 0 9 * * 1";
export const PORT = process.env.PORT || 3000;