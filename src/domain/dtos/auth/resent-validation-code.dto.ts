import { regularExp } from "../../../shared/utils"

export class ResentValidateCodeDto {

  private constructor(
    public readonly email: string
  ){}

  public static create(obj: {[key: string]: any}): [ResentValidateCodeDto?, string?]{

    const { email } = obj

    if ( !email ) return [ undefined, 'El email es obligatorio para reenviar el código de verificación']

    if ( !regularExp.email.test( email ) ) return [ undefined, 'El email proporcionado no es válido' ]

    return [ new ResentValidateCodeDto( email ) ]

  }

}