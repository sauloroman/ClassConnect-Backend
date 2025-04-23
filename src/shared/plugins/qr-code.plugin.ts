import QRCode from 'qrcode'

export const QRCodeAdapter = {

  generateCode: <T>( data: T, fileName: string ) => {
    return new Promise(( res, _ ) => {
      QRCode.toFile(
        fileName,
        JSON.stringify( data ),
        { errorCorrectionLevel: 'M', type: 'png', margin: 2 },
        (error) => {
          if ( error ) return res( null )
          res( fileName )
        }
      )
    }) 
  }

}