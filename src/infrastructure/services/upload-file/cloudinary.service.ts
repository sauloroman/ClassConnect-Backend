import { FileUploadService } from "../../../domain/services/upload-file.service";
import { v2 as cloudinary } from 'cloudinary'
import { CustomError } from "../../../shared/errors";
import { envs } from "../../../shared/plugins";

cloudinary.config( envs.CLOUDINARY_URL )

export class CloudinaryFileUploadService implements FileUploadService {

  public async uploadFile(file: any, folder: string, validExtentions: string[]): Promise<string> {
    return ''
  }

  public async uploadQRCodeGenerated( filePath: string | any, folder: string ): Promise<string> {
    const { secure_url: qrCodeUrl } = await cloudinary.uploader.upload(
      filePath, 
      {
        folder: folder,
        resource_type: 'image'
      }
    )

    if ( !qrCodeUrl ) throw CustomError.internalServerError('El código QR no ha sido subido a la nube')
    
    return qrCodeUrl
  }

}