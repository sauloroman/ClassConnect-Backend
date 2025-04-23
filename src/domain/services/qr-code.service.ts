export abstract class QRCodeService {
  abstract generateQRCodeUrl<T>( data: T, folder: string ): Promise<string>
  abstract createQRCode<T>( data: T ): Promise<unknown>
  abstract uploadQRCode( filePath: unknown, folder: string ): Promise<string>
}