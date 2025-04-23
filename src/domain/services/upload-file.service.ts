export abstract class FileUploadService {
  abstract uploadFile( file: any, folder: string, validExtentions: string[] ): Promise<string>
  abstract uploadQRCodeGenerated( filePath: string | any, folder: string ): Promise<string>
}