import { ValidateCodeService } from "../aplication/services";
import { NodemailerService } from "../infrastructure/services/email/nodemailer.service";
import { RepositoriesContainer } from "./repositories.container";

const { validateCodeRepo, userRepo } = RepositoriesContainer.getInstance()

const emailService = new NodemailerService()

export const validateCodeService = new ValidateCodeService({
  validateCodeRepo: validateCodeRepo,
  userRepo: userRepo,
  emailSender: emailService,
})


