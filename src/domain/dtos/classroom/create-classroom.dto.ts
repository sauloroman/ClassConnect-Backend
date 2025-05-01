export class CreateClassroomDto {

  private constructor(
    public readonly title: string,
    public readonly group: string,
    public readonly categories: string[],
  ) {}

  public static create( obj: {[key: string]: any}): [ CreateClassroomDto?, string? ] {
    
    const { title, group, categories } = obj

    if ( !title ) return [ undefined, 'El titulo del classroom es necesario' ]
    if ( !group ) return [ undefined, 'El grupo del classroom es necesario']
    if ( !categories || categories?.length === 0 ) return [ undefined, 'Las categories son necesarias']

    return [ 
      new CreateClassroomDto(
        title,
        group,
        categories
      ) 
    ]
  }

}