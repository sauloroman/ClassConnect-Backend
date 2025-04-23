import fs from 'fs'
import path from 'path'
import { QRCodeService } from "../../../domain/services/qr-code.service";
import { FileUploadService } from "../../../domain/services/upload-file.service";
import { getIdAdapter, QRCodeAdapter } from "../../../shared/plugins";

interface QRCodeServiceImpOptions {
  fileUploaderService: FileUploadService 
}

export class QRCodeServiceImp implements QRCodeService {

  private readonly fileUploaderService: FileUploadService

  constructor({fileUploaderService}: QRCodeServiceImpOptions){
    this.fileUploaderService = fileUploaderService
  }

  async createQRCode<T>( data: T ): Promise<{ nameQRCode: string, pathQRCode: unknown }> {

    const nameQRCode = getIdAdapter.uuid() + '.png'

    const pathQRCode = await QRCodeAdapter.generateCode<T>( 
      data, 
      nameQRCode,
    )

    return { nameQRCode, pathQRCode }
  }

  async uploadQRCode( filePath: unknown, folder: string ): Promise<string> {
    const qrCodeUrl = await this.fileUploaderService.uploadQRCodeGenerated( filePath, folder )
    return qrCodeUrl
  }

  async generateQRCodeUrl<T>( data: T, folder: string ): Promise<string> {
    const { nameQRCode, pathQRCode } = await this.createQRCode( data ) 
    const qrCodeUrl = await this.uploadQRCode( pathQRCode, folder )
    fs.unlinkSync( path.join( __dirname, '../../../../', nameQRCode ) )
    return qrCodeUrl
  }

}