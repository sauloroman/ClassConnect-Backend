import { CustomError } from "../../shared/errors"

export class LoginSessionEntity {

  private constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly userId: string,
    public readonly ip?: string,
    public readonly os?: string,
    public readonly browser?: string,
    public readonly device?: string,
  ){}

  private static sendErrorForStringTypes = ( prop: string ): CustomError => {
    throw CustomError.badRequest(`No existe ${prop}`)
  }

  public static fromObject( obj: {[key: string]: any}): LoginSessionEntity {

    for( const [key, value] of Object.entries(obj) ) {
      if ( typeof key === 'string' && value === undefined ) {
        this.sendErrorForStringTypes( key )
      }
    }

    const {
      id,
      createdAt,
      userId,
      ip,
      os,
      browser,
      device
    } = obj

    return new LoginSessionEntity(
      id,
      createdAt,
      userId,
      ip,
      os,
      browser,
      device
    )

  }

}