import { EnrollmentStatus } from "../../../shared/enums";

export class UpdateEnrollmentDto {

  private constructor(
    public readonly status?: EnrollmentStatus,
    public readonly progress?: number,
  ){}

  public static create( obj: {[key: string]: any} ): UpdateEnrollmentDto {

    const { status, progress } = obj

    return new UpdateEnrollmentDto(
      status,
      progress
    )

  }

}