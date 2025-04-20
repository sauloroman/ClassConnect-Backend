export class ValidateUserDto {

  private constructor(
    public readonly email: string,
    public readonly code: string,
  ){}

  private static validateEmptyValue( name: string, value: string ): string | null {
    if ( value.trim().length == 0 ) return `${name} es necesario`
    return null
  }

  public static create( obj: {[key: string]: any}): [ ValidateUserDto?, string? ] {
    
    for( const [ key, value ] of Object.entries( obj )) {
      const errorMessage = this.validateEmptyValue( key, value )
      if ( errorMessage ) return [ undefined, errorMessage ]
    }

    const { email, code } = obj

    return [ new ValidateUserDto( email, code ) ]

  }

}