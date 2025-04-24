export abstract class FileUploadService {
  abstract uploadFile( file: any, folder: string, validExtentions: string[], resourceType: any ): Promise<string>
  abstract uploadQRCodeGenerated( filePath: string | any, folder: string ): Promise<string>
  abstract destroyFile( filePathInCloud: string, resourceType: string ): Promise<boolean | null>
}