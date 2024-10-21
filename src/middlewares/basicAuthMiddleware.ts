import basicAuth from "express-basic-auth";

export const basicAuthMiddleware = basicAuth({
  users: { [process.env.BASIC_AUTH_USER as string]: process.env.BASIC_AUTH_PASSWORD as string },
  challenge: true,
});
