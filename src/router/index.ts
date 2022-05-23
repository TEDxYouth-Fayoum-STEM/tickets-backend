import express from "express";
import { respond } from "./respond";
import { bootstrapRoutes, handleError } from "./routes";

export type RouteMethod = (req: ApiReq, res: ApiRes) => RouteRes;

const router = express.Router();

// routes
bootstrapRoutes(router, respond);

export { router, handleError };
