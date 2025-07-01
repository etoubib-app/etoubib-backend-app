import { PaginationQueryDto } from '@lib/shared/dto';
import { DBErrorCode, TPaginatedData } from '@lib/shared/types';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Repository, DeepPartial, FindOneOptions, FindOptionsWhere, FindManyOptions, FindOptionsOrder } from 'typeorm';
import { QueryFailedError } from 'typeorm/error/QueryFailedError';

export abstract class BaseService<Entity extends { id: string, createdAt: Date }> {
    protected entityName: string
    private defaultPerPage = 10

    constructor(protected readonly repository: Repository<Entity>) {
        this.entityName = this.repository.metadata.name;
    }

    async findAll(query: PaginationQueryDto, options?: FindManyOptions<Entity>): Promise<TPaginatedData<Entity>> {
        const { page = 1, limit = this.defaultPerPage } = query;
        const [data, total] = await this.repository.findAndCount({
            take: limit,
            skip: (page - 1) * limit,
            order: { createdAt: 'DESC' } as FindOptionsOrder<Entity>,
            ...options,
        });
        return { data, page, total, limit };
    }

    async findOne(id: string, options?: FindOneOptions<Entity>): Promise<Entity> {
        const entity = await this.repository.findOne({ where: { id } as FindOptionsWhere<Entity>, ...options });
        if (!entity) throw new NotFoundException(({ message: `${this.entityName} with id ${id} not found` }));
        return entity
    }

    async create(data: DeepPartial<Entity>): Promise<Entity> {
        try {
            const entity = this.repository.create(data);
            return await this.repository.save(entity);
        } catch (error) {
            this.handleDbError(error);
        }
    }

    async update(id: string, data: DeepPartial<Entity>): Promise<Entity> {
        const entity = await this.repository.preload({ id, ...data } as any);
        if (!entity) throw new NotFoundException({ message: `${this.entityName} with id ${id} not found` });

        try {
            return await this.repository.save(entity);
        } catch (error) {
            this.handleDbError(error);
        }
    }

    async remove(id: string): Promise<boolean> {
        const entity = await this.findOne(id);
        try {
            await this.repository.remove(entity);
            return true;
        } catch (error) {
            this.handleDbError(error);
        }
    }

    // TODO: move to a helper
    protected handleDbError(error: any): never {
        if (error instanceof QueryFailedError) {
            const err = error as QueryFailedError & { code?: string; detail?: string };

            switch (err.code) {
                case DBErrorCode.PgUniqueConstraintViolation:
                    throw new ConflictException({
                        message: 'Unique constraint violated',
                        detail: err.detail,
                    });

                case DBErrorCode.PgForeignKeyConstraintViolation:
                    throw new BadRequestException({
                        message: 'Invalid reference (foreign key violation)',
                        detail: err.detail,
                    });

                case DBErrorCode.PgNotNullConstraintViolation:
                    throw new BadRequestException({
                        message: 'Missing required field (not null)',
                        detail: err.detail,
                    });

                default:
                    throw new BadRequestException({
                        message: 'Database constraint error',
                        detail: err.detail,
                    });
            }
        }

        throw error;
    }
}