import { FileUploadService } from "../../../domain/services/upload-file.service";
import { v2 as cloudinary } from 'cloudinary'
import { CustomError } from "../../../shared/errors";
import { envs } from "../../../shared/plugins";

cloudinary.config( envs.CLOUDINARY_URL )

export class CloudinaryFileUploadService implements FileUploadService {

  public async uploadFile( 
    file: any, 
    folder: string, 
    validExtentions: string[],
    resourceType: any,
  ): Promise<string> {
    
    const fileExtention = await file.mimetype.split('/')[1] ?? ''

    if ( !validExtentions.includes( fileExtention ) ) {
      throw CustomError.badRequest(`La extension ${fileExtention} no es valida. Solo se permiten: ${validExtentions.join(', ')}`)
    }

    const { tempFilePath } = file

    const { secure_url: fileUrl } = await cloudinary.uploader.upload( 
      tempFilePath, 
      { 
        folder, 
        type: 'upload', 
        resource_type: resourceType 
      } 
    ) 

    return fileUrl
  }

  public async destroyFile( filePathInCloud: string, resourceType: string ): Promise<boolean | null> {
    try {
      await cloudinary.api.delete_resources(
        [ filePathInCloud ], 
        { type: 'upload', resource_type: resourceType 
      })
      return true
    } catch (error) {
      throw CustomError.internalServerError('No se ha podido eliminar el archivo')      
    }

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