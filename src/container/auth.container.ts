import { AuthService } from "../aplication/services";
import { AuthController } from "../presentation/controllers/auth.controller";
import { RepositoriesContainer } from "./repositories.container";
import { validateCodeService } from './validate-code.container';

const { userRepo } = RepositoriesContainer.getInstance()

export const authService = new AuthService({
  userRepo: userRepo,
  validateCodeService: validateCodeService
})

export const authController = new AuthController( authService )