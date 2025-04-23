export abstract class QRCodeService {

  abstract createQRCode<T>( data: T ): Promise<unknown>
  abstract uploadQRCode( code: unknown ): Promise<string>

}