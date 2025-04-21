import { regularExp } from "../../../shared/utils"

export class ChangePasswordDto {

  private constructor(
    public readonly userEmail: string,
    public readonly newPassword: string,
  ){}

  public static create( obj: {[key: string]: any} ): [ChangePasswordDto?, string?] {

    const { userEmail, newPassword } = obj

    if ( !userEmail ) return [ undefined, 'El email es obligatorio']
    if ( !regularExp.email.test( userEmail ) ) return [ undefined, 'El email no es valido']
    if ( !newPassword ) return [ undefined, 'La nueva contraseña es obligatoria']

    return [ new ChangePasswordDto( userEmail, newPassword ) ]

  }

}