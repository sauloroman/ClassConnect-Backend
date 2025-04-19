import crypto from 'crypto'

interface ICryptoAdapter {
  generateSecureCode: ( length: number ) => string
}

export const cryptoAdapter: ICryptoAdapter = {

  generateSecureCode: ( length: number ) => {
    const max = Math.pow(10, length) - 1
    const code = crypto.randomInt( 0, max + 1 )
    return code.toString().padStart(length, '0')
  }

}