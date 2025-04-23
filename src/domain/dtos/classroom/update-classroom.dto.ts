export class UpdateClassroomDto {

  private constructor(
    public readonly updatedAt?: Date,
    public readonly description?: string,
    public readonly img?: string,
    public readonly qrCode?: string,
    public readonly color?: string,
  ){}

  public static create( obj: {[key: string]: any} ): UpdateClassroomDto {

    const { updatedAt, description, img, qrCode, color } = obj
    
    return new UpdateClassroomDto(
      updatedAt,
      description,
      img,
      qrCode,
      color
    )

  }

}