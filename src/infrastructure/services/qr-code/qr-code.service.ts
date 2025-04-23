import { QRCodeService } from "../../../domain/services/qr-code.service";
import { getIdAdapter, QRCodeAdapter } from "../../../shared/plugins";

// interface QRCodeServiceImpOptions {
//   fileUploader: 
// }

export class QRCodeServiceImp implements QRCodeService {

  async createQRCode<T>( data: T ): Promise<unknown> {

    const nameQRCode = getIdAdapter.uuid() + '.png'

    const qrCode = await QRCodeAdapter.generateCode<T>( 
      data, 
      nameQRCode,
    )

    return qrCode
  }

  async uploadQRCode( code: unknown ): Promise<string> {
    return ''
  }

}