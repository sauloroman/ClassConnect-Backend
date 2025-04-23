import { envs } from "../shared/plugins";
import { NodemailerService } from "../infrastructure/services/email/nodemailer.service";
import { AuthService, ClassroomService, LoginSessionService, UserService, ValidateCodeService } from "../aplication/services";
import { RepositoriesContainer } from "./repositories.container";
import { QRCodeServiceImp } from "../infrastructure/services/qr-code/qr-code.service";

const { userRepo, validateCodeRepo, loginSessionRepo, classroomRepo } = RepositoriesContainer.getInstance()

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

export const loginSessionService = new LoginSessionService({ loginSessionRepo })

export const authService = new AuthService({
  userRepo: userRepo,
  emailSender: emailService,
  loginSessionService: loginSessionService,
  validateCodeService: validateCodeService
})

export const qrCodeService = new QRCodeServiceImp()

export const classroomService = new ClassroomService({ classroomRepo, qrCodeService })