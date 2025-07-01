import { Repository, } from 'typeorm';
import { BaseService } from './base.service';

export abstract class SoftDeleteBaseService<
  Entity extends { id: string; createdAt: Date, deletedAt: Date },
> extends BaseService<Entity> {

  constructor(protected readonly repository: Repository<Entity>) {
    super(repository);
  }

  override async remove(id: string): Promise<boolean> {
    try {
      const result = await this.repository.softDelete(id);
      return !!result.affected;
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async restore(id: string): Promise<Entity> {
    try {
      await this.repository.restore(id);
      return this.findOne(id)
    } catch (error) {
      this.handleDbError(error);
    }
  }
}
