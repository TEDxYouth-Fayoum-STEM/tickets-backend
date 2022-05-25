import cloudinary, { UploadApiOptions, UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import env from "@env";

export default function bootstrapDb(): ApiMiddleware {
  cloudinary.v2.config({
    cloud_name: env.cloudinary.name,
    api_key: env.cloudinary.key,
    api_secret: env.cloudinary.secret
  });
  return function (req: ApiReq, res: ApiRes, next: ApiNext) {
    req.cloud = async function (
      buffer: Buffer,
      options: UploadApiOptions
    ): Promise<UploadApiResponse> {
      return new Promise((resolve, reject) => {
        const cld_upload_stream = cloudinary.v2.uploader.upload_stream(
          options,
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(cld_upload_stream);
      });
    };
    next();
  };
}
