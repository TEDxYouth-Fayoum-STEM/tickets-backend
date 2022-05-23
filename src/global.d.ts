import { NextFunction, Request, Response } from "express";
import { IDb } from "./db/middleware";
import { ClassConstructor } from "class-transformer";

// verbose route response
interface VRouteRes {
  status?: boolean;
  code?: number;
  data?: unknown;
  errors?: string[];
}

type ExtendedApiReq<Body> = Request & {
  body: Body;
};

declare global {
  namespace Express {
    interface Request {
      db: IDb;
    }
  }

  type ApiReq = Request;
  type ApiRes = Response;

  type ApiNext = NextFunction;

  type ApiMiddleware = (
    req: ApiReq,
    res: ApiRes,
    next: NextFunction
  ) => void | Promise<void>;

  type RouteRes = boolean | number | VRouteRes;

  interface RouteReqFiles {
    [index: string]: {
      mimetype: RegExp;
      maxSize: number;
      req?: true;
    };
  }
  interface ControllerRoute<Body = object> {
    method?: "post";
    path: string;
    body?: {
      multipart?: {
        maxFileSize: number;
        fields: number;
        files: RouteReqFiles;
      };
      dto: ClassConstructor<object>;
    };
    handle(
      req: ExtendedApiReq<Body>,
      res: ApiRes
    ): RouteRes | Promise<RouteRes>;
  }
  interface Controller {
    scope: string;
    routes: ControllerRoute[];
  }
}
