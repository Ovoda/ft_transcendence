import { Logger, NotFoundException } from "@nestjs/common";
import { paginate } from "nestjs-typeorm-paginate/index";
import { DeepPartial, FindOneOptions, Repository } from "typeorm";
import { DatabaseDuplicateException } from "../exceptions/databaseDuplicate.exception";
import { DatabaseErrorException } from "../exceptions/databaseError.exception";
import { DatabaseNullValueException } from "../exceptions/databaseNullValue.exception";
import { FindManyFilter } from "./findManyFilter.interface";
import { Paginate } from "./paginate.class";

export abstract class CrudService<T> {
    constructor(
        protected readonly repository: Repository<T>,
        protected readonly logger: Logger) { }

    async create(data: DeepPartial<T>): Promise<T> {
        return await this.repository.create(data);
    }

    async save(data: DeepPartial<T>): Promise<T> {
        const response = await this.repository.save(data).catch((error) => {
            if (error.code === "23505") {
                throw new DatabaseDuplicateException(error.detail);
            } else if (error.code === "23502") {
                throw new DatabaseNullValueException(error.detail);
            } else {
                throw new DatabaseErrorException(error.detail);
            }
        });
        return response;
    }

    async findOneById(id: string, options: FindOneOptions = {}, primaryKey: string = 'id'): Promise<T> {

        options["where"] = {
            [primaryKey]: id,
        }

        try {
            const entity = await this.repository.findOneOrFail(options);
            return entity;
        } catch (error: any) {
            throw new NotFoundException({
                error: `${this.repository.metadata.name} with ${primaryKey} ${id} not found`,
                context: options,
            })
        }
    }

    async findOne(options: FindOneOptions = {}) {
        const entity = this.repository.findOneOrFail(options).catch((error) => {
            throw new NotFoundException({
                error: `${this.repository.metadata.name} not found`,
                context: options,
            });
        });
        return entity;
    }

    async findMany(data: FindManyFilter<T>): Promise<Paginate<T>> {
        const { limit, page, ...options } = data;

        try {
            const entities = await paginate<T>(
                this.repository,
                {
                    limit: limit || 20,
                    page: page || 1,
                },
                options
            );
            return entities;
        } catch (error: any) {
            throw new NotFoundException({ error: error.detail });
        }
    }

    async updateById(id: string, data: DeepPartial<T>, primaryKey = 'id'): Promise<T> {
        const current = await this.findOneById(id, {}, primaryKey);
        const merged = (await this.repository.merge(current, data)) as DeepPartial<T>;
        return await this.save(merged);
    }

    async delete(id: string, primaryKey = 'id'): Promise<boolean> {
        const entity = await this.findOneById(id, {}, primaryKey);
        try {
            await this.repository.remove(entity);
            return true;
        }
        catch (error: any) {
            throw new DatabaseErrorException(error.detail);
        }
    }

    async exists(options: FindOneOptions<T>): Promise<boolean> {
        const user = await this.repository.findOne(options);
        return user ? true : false;
    }

    async count(options: FindOneOptions<T>): Promise<number> {
        const nb = await this.repository.count(options);
        return nb;
    }

}