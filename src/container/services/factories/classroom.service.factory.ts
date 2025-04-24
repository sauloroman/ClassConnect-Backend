import { ClassroomService } from "../../../aplication/services";
import { RepositoriesContainer } from "../../repositories.container";
import { qrCodeService } from './qr-code.service.factory';
import { fileUploadService } from './file-upload.service.factory';

export const classroomService = new ClassroomService({
  classroomRepo: RepositoriesContainer.getInstance().classroomRepo,
  enrollmentRepo: RepositoriesContainer.getInstance().enrollmentRepo,
  qrCodeService,
  fileUploadService,
})