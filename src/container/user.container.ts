import { ValidateCodeService } from "../aplication/services";
import { UserService } from "../aplication/services/user.service";
import { PrismaValidateCodeRepository } from "../infrastructure/repositories";
import { PrismaUserRepository } from "../infrastructure/repositories/prisma/user.repository.imp";
import { NodemailerService } from "../infrastructure/services/email/nodemailer.service";
import { UserControllers } from "../presentation/controllers/user.controller";

const userRepo = new PrismaUserRepository()
const validateCodeRepo = new PrismaValidateCodeRepository()
const emailService = new NodemailerService()

const validateCodeService = new ValidateCodeService({
  validateCodeRepo: validateCodeRepo,
  userRepo: userRepo,
  emailSender: emailService,
})

const userService = new UserService({
  validateCodeService: validateCodeService,
  userRepo: userRepo,
})

export const userController = new UserControllers(userService)
