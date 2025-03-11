import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
} from 'typeorm';

import { BaseEntity } from './base.entity';

export interface IBaseService<
  Entity extends BaseEntity,
  CreateBaseDto extends DeepPartial<Entity>,
  UpdateBaseDto extends DeepPartial<Entity>,
> {
  create(createBaseDto: CreateBaseDto): Promise<Entity>;

  findAll(options?: FindManyOptions<Entity>): Promise<Entity[]>;

  findOne(options: FindOneOptions<Entity>): Promise<Entity | null>;

  getOne(id: string): Promise<Entity | null>;

  updateOne(id: string, updateBaseDto: UpdateBaseDto): Promise<UpdateResult>;
}
