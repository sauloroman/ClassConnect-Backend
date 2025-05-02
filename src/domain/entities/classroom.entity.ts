import { CustomError } from "../../shared/errors"

export class ClassroomEntity {

  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly group: string,
    public readonly career: string,
    public readonly code: string,
    public readonly createdAt: Date,
    public readonly instructorId: string,
    public readonly updatedAt?: Date,
    public readonly description?: string,
    public readonly img?: string,
    public readonly color?: string,
    public readonly qrCode?: string,
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

    const { 
      id, 
      title, 
      group,
      career,
      code, 
      createdAt, 
      instructorId, 
      updatedAt, 
      description, 
      img, 
      color, 
      qrCode, 
    } = obj

    return new ClassroomEntity(
      id, 
      title,
      group,
      career,
      code,
      createdAt,
      instructorId,
      updatedAt,
      description,
      img,
      color,
      qrCode,
    )

  }

}