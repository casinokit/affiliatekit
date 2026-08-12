export type PaginationMeta = {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

export type Paginated<T> = {
  data: T[]
  meta: PaginationMeta
}
