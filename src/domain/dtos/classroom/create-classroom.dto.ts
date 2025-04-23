export class CreateClassroomDto {

  private constructor(
    public readonly title: string,
  ) {}

  public static create( obj: {[key: string]: any}): [ CreateClassroomDto?, string? ] {

    if ( !obj.title ) return [ undefined, 'El titulo del classroom es necesario' ]

    return [ new CreateClassroomDto(obj.title) ]

  }

}