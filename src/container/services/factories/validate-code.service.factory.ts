import { ValidateCodeService } from "../../../aplication/services";
import { envs } from "../../../shared/plugins";
import { RepositoriesContainer } from "../../repositories.container";

export const validateCodeService = new ValidateCodeService({
  duration: envs.VERIFICATION_CODE_DURATION,
  validateCodeRepo: RepositoriesContainer.getInstance().validateCodeRepo
})
