import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'

export default function errorMiddleware(err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {
  res.status(500).send("Erro no servidor");
}