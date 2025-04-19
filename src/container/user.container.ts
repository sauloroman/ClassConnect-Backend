import { UserControllers } from "../presentation/controllers/user.controller";
import { RepositoriesContainer } from "./repositories.container";
import { UserService } from '../aplication/services/user.service';
import { validateCodeService } from "./validate-code.container";

const repositories = RepositoriesContainer.getInstance()

const userService = new UserService({
  userRepo: repositories.userRepo,
  validateCodeService: validateCodeService
})

export const userController = new UserControllers(userService)
