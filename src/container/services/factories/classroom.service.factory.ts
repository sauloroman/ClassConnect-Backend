import { ClassroomService } from "../../../aplication/services";
import { RepositoriesContainer } from "../../repositories.container";
import { qrCodeService } from './qr-code.service.factory';
import { fileUploadService } from './file-upload.service.factory';

const { classroomCategoriesRepo, classroomCategoryRepo, classroomRepo } = RepositoriesContainer.getInstance()

export const classroomService = new ClassroomService({
  classroomRepo: classroomRepo,
  classroomCategoriesRepo: classroomCategoriesRepo,
  classroomCategoryRepo: classroomCategoryRepo,
  enrollmentRepo: RepositoriesContainer.getInstance().enrollmentRepo,
  qrCodeService,
  fileUploadService,
})