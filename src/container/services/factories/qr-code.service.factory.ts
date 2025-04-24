import { QRCodeServiceImp } from "../../../infrastructure/services/qr-code/qr-code.service";
import { fileUploadService } from "./file-upload.service.factory";

export const qrCodeService = new QRCodeServiceImp({
  fileUploaderService: fileUploadService
})