export interface Pagination<T> {
   totalCount: number;
   page: number;
   limit: number;
   data: Array<T>;
}