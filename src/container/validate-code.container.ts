import { ValidateCodeService } from "../aplication/services";
import { NodemailerService } from "../infrastructure/services/email/nodemailer.service";
import { envs } from "../shared/plugins";
import { RepositoriesContainer } from "./repositories.container";

const { validateCodeRepo } = RepositoriesContainer.getInstance()

export const emailService = new NodemailerService({
  mailerService: envs.MAILER_SERVICE,
  mailerEmail: envs.MAILER_EMAIL,
  postToProvider: envs.SEND_EMAIL,
  senderEmailPassword: envs.MAILER_SECRET_KEY,
})

export const validateCodeService = new ValidateCodeService({
  duration: envs.VERIFICATION_CODE_DURATION,
  validateCodeRepo: validateCodeRepo,
  emailSender: emailService,
})


