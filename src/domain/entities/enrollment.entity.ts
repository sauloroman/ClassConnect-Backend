import { EnrollmentStatus } from "../../shared/enums";
import { CustomError } from "../../shared/errors";

export class EnrollmentEntity {

  private constructor(
    public readonly id: string,
    public readonly status: EnrollmentStatus,
    public readonly progress: number,
    public readonly joinedAt: Date,
    public readonly studentId: string,
    public readonly classroomId: string,
  ){}

  private static validateStringValue = ( prop: string, value: string ) => {
    if ( value === undefined || value === null ) throw CustomError.badRequest(`No existe ${prop}`)
  }

  private static validateNumberValue = ( prop: string, value: number ) => {
    if ( value < 0 || value === null || value === undefined ) throw CustomError.badRequest(`No es un valor valido ${prop}`)
  }

  public static fromObject( obj: {[key: string]: any} ): EnrollmentEntity {

    for( const [ key, value ] of Object.entries(obj) ) {
      if ( typeof key === 'string') {
        this.validateStringValue( key, value )
      }

      if ( typeof key === 'number' ) {
        this.validateNumberValue( key, value )
      }
    }

    const { id, status, progress, joinedAt, studentId, classroomId } = obj

    return new EnrollmentEntity(
      id,
      status,
      progress,
      joinedAt,
      studentId,
      classroomId
    )

  }

}