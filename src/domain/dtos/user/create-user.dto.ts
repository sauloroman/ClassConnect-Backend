import { Roles } from "../../../shared/enums";
import { regularExp } from "../../../shared/utils";

export class CreateUserDto {

  private constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: Roles,
  ){}

  private static validateEmptyValue( name: string, value: string ): string | null {
    if ( value.trim().length == 0 ) return `${name} es necesario`
    return null
  }

  public static create( obj: {[key: string]: any} ): [ CreateUserDto?, string? ] {

    for( const [ name, value ] of Object.entries( obj )) {
      const errorMessage = this.validateEmptyValue( name, value)
      if ( errorMessage ) return [undefined, errorMessage]
    }

    const { firstName, lastName, email, password, role } = obj

    if ( !regularExp.email.test( email ) ) return [ undefined, 'El email no es valido']

    return [
      new CreateUserDto(
        firstName,
        lastName,
        email,
        password,
        role
      )
    ]
  }

}