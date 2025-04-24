import { AuthService } from "../../../aplication/services";
import { RepositoriesContainer } from "../../repositories.container";
import { emailService } from "./email.service.factory";
import { loginSessionService } from './login-session.service.factory';
import { validateCodeService } from './validate-code.service.factory';

export const authService = new AuthService({
  userRepo: RepositoriesContainer.getInstance().userRepo,
  emailSender: emailService,
  loginSessionService,
  validateCodeService
})