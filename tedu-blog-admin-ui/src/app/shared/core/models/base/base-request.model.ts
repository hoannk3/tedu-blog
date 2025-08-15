export interface BasePageRequest {
    page_numb: number | null;
    page_size: number | null;
    sorts: Sort[] | null;
}

export interface Sort {
    field: string,
    is_desc: boolean
}