import { NodemailerService } from "../../../infrastructure/services/email/nodemailer.service";
import { envs } from "../../../shared/plugins";

export const emailService = new NodemailerService({
  mailerService: envs.MAILER_SERVICE,
  mailerEmail: envs.MAILER_EMAIL,
  postToProvider: envs.SEND_EMAIL,
  senderEmailPassword: envs.MAILER_SECRET_KEY,
})