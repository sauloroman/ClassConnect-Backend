export class CreateLoginSessionDto {

  private constructor(
    public readonly userId: string,
    public readonly ip?: string,
    public readonly browser?: string,
    public readonly os?: string,
    public readonly device?: string,
  ){}

  public static create( obj: {[key: string]: any}): [ CreateLoginSessionDto?, string? ] {

    const { userId, ip, browser, os, device } = obj

    if ( !userId ) return [undefined, 'El id del usuario es necesario para crear un registro de inicio de sesión']

    return [ new CreateLoginSessionDto( userId, ip, browser, os, device ) ]
  }
  
}