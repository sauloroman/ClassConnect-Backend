import { regularExp } from "../../../shared/utils"

export class ForgotPasswordDto {

  private constructor(
    public readonly email: string
  ){}

  public static create( obj: {[key: string]: any} ): [ForgotPasswordDto?, string?] {

    const { email } = obj

    if ( !email ) return [ undefined, 'El correo electrónico es necesario' ]
    if ( !regularExp.email.test( email ) ) return [ undefined, 'El correo electrónico no es valido' ]

    return [ new ForgotPasswordDto( email ) ]

  } 

}