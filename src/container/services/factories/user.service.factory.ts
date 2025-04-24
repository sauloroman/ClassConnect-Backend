import { UserService } from "../../../aplication/services";
import { RepositoriesContainer } from "../../repositories.container";
import { emailService } from "./email.service.factory";
import { fileUploadService } from "./file-upload.service.factory";
import { validateCodeService } from './validate-code.service.factory';

export const userService = new UserService({
  userRepo: RepositoriesContainer.getInstance().userRepo,
  validateCodeService,
  fileUploadService: fileUploadService,
  emailSender: emailService,
})