export interface Pagination<T> {
   totalCount: number;
   hasNextPage: boolean;
   hasPreviousPage: boolean;
   page: number;
   limit: number;
   data: Array<T>;
}