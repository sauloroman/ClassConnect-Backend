export interface PaginationMeta {
  currentPage: number,
  totalPages: number,
  totalItems: number,
  prevPage: number | null,
  nextPage: number | null,
  limit: number
}

export interface PaginationOptions {
  page: number,
  limit: number,
  totalItems: number,
}

export interface PaginationResult<T> {
  meta: PaginationMeta,
  items: T[],
}



