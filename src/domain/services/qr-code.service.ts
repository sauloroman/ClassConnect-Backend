export abstract class QRCodeService {
  abstract createQRCode<T>( data: T ): Promise<{ nameQRCode: string, pathQRCode: unknown }>
  abstract uploadQRCode( filePath: unknown, folder: string ): Promise<string> 
  abstract deleteQRCodeInCloud(filePathInCloud: string): Promise<void>
  abstract deleteQRCodeInServer(fileName: string): void
}