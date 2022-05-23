import { MulterError } from "multer";
import env from "@env";
import { sendResponse } from "./respond";

export function limitRequest(multipart: boolean): ApiMiddleware {
  return function (req: ApiReq, res: ApiRes, next: ApiNext) {
    if (
      multipart &&
      parseInt(<string>req.header("Content-Length")) >
        env.req.maxBodySize + env.req.maxFilesSize
    ) {
      sendResponse(res, 413);
      req.socket.end();
    } else if (
      !multipart &&
      <string>req.header("Content-Type") !== "application/json"
    ) {
      sendResponse(res, 400);
      req.socket.end();
    } else {
      next();
    }
  };
}

export function handleError(
  error: unknown,
  req: ApiReq,
  res: ApiRes,
  next: ApiNext
): void {
  if (error instanceof MulterError) {
    sendResponse(
      res,
      error.code === "LIMIT_FILE_SIZE"
        ? {
            code: 413,
            errors: [<string>error.field]
          }
        : 413
    );
  } else {
    sendResponse(res, 500);
  }
  next();
}
