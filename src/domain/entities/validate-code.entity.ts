import { CustomError } from "../../shared/errors"

export class ValidateCodeEntity {

  private constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly userId: string,
    public readonly createdAt: Date,
  ){}

  private static sendErrorForStringTypes = ( prop: string ): CustomError => {
    throw CustomError.badRequest(`No existe ${prop}`)
  }

  public static fromObject( obj: {[ key: string]: any} ): ValidateCodeEntity {

    const { id, code, userId, createdAt } = obj

    for( const [key, value] of Object.entries(obj) ) {
      if ( typeof key === 'string' && value === undefined ) {
        this.sendErrorForStringTypes( key )
      }
    }

    return new ValidateCodeEntity(
      id,
      code,
      userId,
      createdAt
    )

  }

}