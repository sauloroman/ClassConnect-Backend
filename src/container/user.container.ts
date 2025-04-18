import { UserService } from "../aplication/services/user.service";
import { PrismaUserRepository } from "../infrastructure/repositories/prisma/user.repository.imp";
import { NodemailerService } from "../infrastructure/services/email/nodemailer.service";
import { UserControllers } from "../presentation/controllers/user.controller";

const userRepo = new PrismaUserRepository()
const emailService = new NodemailerService()

const userService = new UserService({
  emailSender: emailService,
  userRepo: userRepo
})

export const userController = new UserControllers(userService)
