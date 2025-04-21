import { regularExp } from "../../../shared/utils"

export class LoginDto {

  private constructor(
    public readonly email: string,
    public readonly password: string,
  ){}
  
  private static validateEmptyValue( name: string, value: string ): string | null {
    if ( value === '' || value === undefined ) return `${name} es necesario`
    return null
  }

  public static create( obj: {[key: string]: any}): [LoginDto?, string?] {

    for( const [ key, name ] of Object.entries( obj )) {
      const errorMessage = this.validateEmptyValue( key, name )
      if ( errorMessage ) return [ undefined, errorMessage ]
    } 

    const { email, password } = obj

    if ( !regularExp.email.test( email ) ) return [ undefined, 'El email no es valido']

    return [ new LoginDto(email, password) ]

  }

}