export interface BaseReponse<T = void> {
    data?: T extends void ? never : T;
    status?: number;
    success?: boolean;
    message?: string;
}

export interface ListData<T> {
    items: T[];
    total_page: number,
    total_record: number
}

export interface LastUpdated {
    last_updated?: number;
}
