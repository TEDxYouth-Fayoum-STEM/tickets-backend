import { Router } from "express";
import multer, { Field, MulterError } from "multer";
import env from "@env";
import { RespondFunction, sendResponse } from "./respond";
import { limitRequest, handleError } from "./middlewares";
import controllers from "./controllers";

export { handleError };

export function bootstrapRoutes(
  router: Router,
  respond: RespondFunction
): void {
  for (const controller of controllers) {
    for (const route of controller.routes) {
      const method =
        route.method || (route.body !== undefined ? "post" : "get");
      const path = `/${controller.scope}/${route.path}`;
      const handle = respond(route);
      if (route.body && route.body.multipart) {
        const files = Object.keys(route.body.multipart.files);
        const fields: Field[] = [];
        for (const file of files) {
          fields.push({ name: file, maxCount: 1 });
        }
        const upload = multer({
          limits: {
            fieldNameSize: env.req.maxFieldNameSize,
            fieldSize: env.req.maxFieldSize,
            fields: route.body.multipart.fields,
            files: files.length,
            fileSize: route.body.multipart.maxFileSize * (1024 * 1024)
          },
          fileFilter(req, file, cb) {
            if (
              file.mimetype.match(
                <RegExp>route.body?.multipart?.files[file.fieldname].mimetype
              )
            ) {
              cb(null, true);
            } else {
              cb(new MulterError("LIMIT_FILE_SIZE", file.fieldname));
            }
          }
        }).fields(fields);
        router[method](path, limitRequest(true), upload, handle);
      } else {
        router[method](path, limitRequest(false), handle);
      }
    }
  }
  router.all("*", (req, res) => {
    sendResponse(res, 404);
  });
}
