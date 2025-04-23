import { PaginationOptions, PaginationResult } from "../../domain/interfaces";

export const buildPaginationMeta = <T>( items: T[], options: PaginationOptions ): PaginationResult<T> => {

  const { page, limit, totalItems } = options
  const totalPages = Math.ceil( totalItems / limit )

  return  {
    meta: {
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      totalItems,
      totalPages,
      limit,
    },
    items,
  }

}