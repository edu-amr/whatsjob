export const SUBSCRIBE_TABLE = process.env.ENVIRONMENT == "dev" ? "numeros_duplicate" : "numeros";
export const JOBS_TABLE = process.env.ENVIRONMENT == "dev" ? "vagas_duplicate" : "vagas";
export const TIME_TO_SEND_JOBS = process.env.ENVIRONMENT == "dev" ? "*/10 * * * * *" : "0 0 9 * * 1";
export const PORT = process.env.PORT || 3000;