import { validate } from "@v";

function getStatusCode(result: RouteRes) {
  if (typeof result === "number") {
    return result;
  } else if (typeof result === "boolean") {
    return result ? 200 : 400;
  } else {
    return result.code
      ? result.code
      : result.status || result.data !== undefined
      ? 200
      : 400;
  }
}

export function sendResponse(res: ApiRes, result: RouteRes): void {
  const code = getStatusCode(result);
  const status = code >= 400 ? false : true;
  res.statusCode = code;
  const response: Record<string, unknown> = {
    status,
    code: res.statusCode
  };
  if (status) {
    response.data =
      typeof result === "object" && result.data !== undefined
        ? result.data
        : null;
  } else {
    response.error = code >= 500 ? "INTERNAL" : code >= 400 ? "REQUEST" : null;
    response.errors =
      typeof result === "object" && result.errors !== undefined
        ? result.errors
        : [];
  }
  res.json(response);
}

export type RespondFunction = (route: ControllerRoute) => ApiMiddleware;

export function respond(route: ControllerRoute): ApiMiddleware {
  return async function (req: ApiReq, res: ApiRes) {
    try {
      if (route.body !== undefined) {
        if (route.body.multipart) {
          const files = Object.keys(route.body.multipart.files).filter(
            (file) => !!route.body?.multipart?.files[file].req
          );
          if ((req.files?.length || 0) !== files.length) {
            return sendResponse(res, {
              errors: files
            });
          }
        }
        const validation = await validate(route.body.dto, req.body || {});
        if (validation !== true) {
          if (validation === null) {
            return sendResponse(res, 413);
          } else {
            return sendResponse(res, {
              errors: validation
            });
          }
        }
      }
      const result = await route.handle(req, res);
      sendResponse(res, result);
    } catch (error) {
      console.log(error);
      sendResponse(res, 500);
    }
  };
}
