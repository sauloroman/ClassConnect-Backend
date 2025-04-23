export class PaginationDto {

  private constructor(
    public readonly page: number,
    public readonly limit: number
  ){}

  public static create( page: number, limit: number ): [ PaginationDto?, string? ] {

    if ( isNaN( page ) || isNaN( limit ) ) return [ undefined, 'La página y el límite deben ser números']
    if ( page <= 0 ) return [undefined, 'La página deber ser mayor que 0']
    if ( limit <= 0 ) return [undefined, 'El límite debe ser mayor que 0']

    return [ new PaginationDto( page, limit ) ]

  }

}