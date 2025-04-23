import { CustomError } from "../../shared/errors"

export class ClassroomEntity {

  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly code: string,
    public readonly createdAt: Date,
    public readonly instructorId: string,
    public readonly updatedAt?: Date,
    public readonly description?: string,
    public readonly img?: string,
  ){}

  private static sendErrorForStringTypes = ( prop: string ): CustomError => {
    throw CustomError.badRequest(`No existe ${prop}`)
  }

  public static fromObject( obj: {[key: string]: any}): ClassroomEntity {

    for( const [ key, value ] of Object.entries( obj )) {
      if ( typeof key === 'string' && value === undefined ) {
        this.sendErrorForStringTypes( key )
      }
    }

    const { id, title, code, createdAt, instructorId, updatedAt, description, img } = obj

    return new ClassroomEntity(
      id, 
      title,
      code,
      createdAt,
      instructorId,
      updatedAt,
      description,
      img
    )

  }

}