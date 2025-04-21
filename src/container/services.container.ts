import { envs } from "../shared/plugins";
import { NodemailerService } from "../infrastructure/services/email/nodemailer.service";
import { AuthService, UserService, ValidateCodeService } from "../aplication/services";
import { AuthController, UserControllers } from "../presentation/controllers";
import { RepositoriesContainer } from "./repositories.container";

const { userRepo, validateCodeRepo } = RepositoriesContainer.getInstance()

export const emailService = new NodemailerService({
  mailerService: envs.MAILER_SERVICE,
  mailerEmail: envs.MAILER_EMAIL,
  postToProvider: envs.SEND_EMAIL,
  senderEmailPassword: envs.MAILER_SECRET_KEY,
})

export const validateCodeService = new ValidateCodeService({
  duration: envs.VERIFICATION_CODE_DURATION,
  validateCodeRepo: validateCodeRepo
})

export const userService = new UserService({
  userRepo: userRepo,
  validateCodeService: validateCodeService, 
  emailSender: emailService
})

export const authService = new AuthService({
  emailSender: emailService,
  userRepo: userRepo,
  validateCodeService: validateCodeService
})

export const controllers = {
  userController: new UserControllers( userService ),
  authController: new AuthController( authService )
}