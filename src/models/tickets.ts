import { Express } from "express";
import { image } from "@u/mimetypes";
import { TicketPaymentCheckDto, TicketPaymentDto } from "./tickets/dto";
import { checkEmail, checkWaNu } from "./tickets/service";

export default {
  scope: "tickets",
  routes: [
    {
      path: "book",
      body: {
        dto: TicketPaymentDto,
        multipart: {
          maxFileSize: 5,
          fields: 12,
          files: {
            receipt_img: {
              mimetype: image,
              maxSize: 5,
              req: true
            },
            profile_img: {
              mimetype: image,
              maxSize: 5
            }
          } as RouteReqFiles
        }
      },
      async handle(req) {
        if (
          !(await req.db.tickets.checkPayment(req.body.email, req.body.wa_nu))
        )
          return { code: 200, status: false };
        const files = req.files as unknown as {
          [fieldname: string]: Express.Multer.File[];
        };
        const payment = {
          ...req.body,
          receipt_img: await req.cloud(files.receipt_img[0].buffer, {
            public_id: `${req.body.email}`,
            folder: "receipts",
            unique_filename: true
          })
        };
        if (files.profile_img) {
          payment.profile_img = await req.cloud(files.profile_img[0].buffer, {
            public_id: `${req.body.email}`,
            folder: "profile_images",
            unique_filename: true
          });
        }
        return await req.db.tickets.storePayment(payment);
      }
    } as ControllerRoute,
    {
      path: "book/check",
      body: {
        dto: TicketPaymentCheckDto
      },
      async handle(req) {
        switch (req.body.field) {
          case "email":
            if (!checkEmail(req.body.value))
              return { code: 200, status: false };
            if (!(await req.db.tickets.checkEmail(req.body.value)))
              return { code: 200, status: false };
            return true;
          case "wa_nu":
            if (!checkWaNu(req.body.value)) return { code: 200, status: false };
            if (!(await req.db.tickets.checkWaNu(req.body.value)))
              return { code: 200, status: false };
            return true;
            break;
        }
        return 400;
      }
    } as ControllerRoute
  ]
} as Controller;
