// Vercel serverless entry point
import { app, ensureDbConnected } from "../src/server.js";
import type { Request, Response } from "express";

// Ensure DB is connected before handling any request
const handler = async (req: Request, res: Response) => {
  await ensureDbConnected();
  return app(req, res);
};

export default handler;
