export class CreateValidateCodeDto {

  private constructor(
    public readonly code: string,
    public readonly userId: string,
  ){}

  private static validateEmptyValue( name: string, value: string ): string | null {
    if ( value.trim().length == 0 ) return `${name} es necesario`
    return null
  }

  public static create( obj: {[key: string]: any} ): [ CreateValidateCodeDto?, string? ] {

    for( const [ key, value ] of Object.entries( obj )) {
      const errorMessage = this.validateEmptyValue( key, value )
      if ( errorMessage ) return [ undefined, errorMessage] 
    }

    const { code, userId } = obj

    return [ new CreateValidateCodeDto(code, userId) ]

  }

}