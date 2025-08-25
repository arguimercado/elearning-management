declare interface Pagination<T> {
   totalCount: number;
   hasNextPage: boolean;
   hasPreviousPage: boolean;
   page: number;
   limit: number;
   data: Array<T>;
}

declare interface ApiResponse<T> {
   success: boolean;
   error?: Error | null;
   data: T | null;
   message: string;
}
