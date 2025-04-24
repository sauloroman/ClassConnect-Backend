import { LoginSessionService } from "../../../aplication/services";
import { RepositoriesContainer } from "../../repositories.container";

export const loginSessionService = new LoginSessionService({
  loginSessionRepo: RepositoriesContainer.getInstance().loginSessionRepo
})