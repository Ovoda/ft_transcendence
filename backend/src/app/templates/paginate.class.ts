
export class PaginationData {
    itemCount: number;
    totalPage?: number;
    currentPage: number;
    itemsPerPage: number;
    totalItems?: number;
}

export class Paginate<T> {
    meta: PaginationData;
    items: T[];
}