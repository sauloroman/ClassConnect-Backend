import { CustomError } from "../../shared/errors"

export class ClassroomCategoryEntity {

  private constructor(
    public readonly id: string,
    public readonly categoryName: string,
  ){}

  private static sendErrorForStringTypes = ( prop: string ): CustomError => {
    throw CustomError.badRequest(`No existe ${prop}`)
  }

  public static fromObject( obj: {[key: string]: any} ): ClassroomCategoryEntity {

    const { id, categoryName } = obj

    for( const [ key, value ] of Object.entries(obj) ) {
      if ( typeof value === 'string' && value === undefined ) {
        this.sendErrorForStringTypes( key )
      }
    }

    return new ClassroomCategoryEntity(
      id,
      categoryName,
    )

  }

}