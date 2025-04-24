export class JoinStudentDto {

  private constructor(
    public readonly code: string
  ){}

  public static create(obj: {[key: string]: any}): [ JoinStudentDto?, string? ] {
    const { code } = obj
    if ( !code ) return [ undefined, 'El codigo es necesario para unir al estudiante' ]
    return [ new JoinStudentDto( code ) ]
  }

}