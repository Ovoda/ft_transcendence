import { FindManyOptions } from "typeorm";


export interface FindManyFilter<T = any> extends FindManyOptions<T> {
    limit?: number | undefined;
    page?: number | undefined;
}