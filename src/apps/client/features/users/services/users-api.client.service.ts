import { SoftDeleteBaseService } from '@lib/shared/base';
import { CreateUserDto, PaginationQueryDto } from '@lib/shared/dto';
import { User } from '@lib/shared/entities';
import { UserStatus } from '@lib/shared/enums';
import { CLIENT_CONNECTION } from '@lib/shared/modules';
import { TPaginatedData } from '@lib/shared/types';
import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class UserApiService extends SoftDeleteBaseService<User> {
  private readonly userRepository: Repository<User>;

  constructor(@Inject(CLIENT_CONNECTION) connection: DataSource) {
    super(connection.getRepository(User));
    this.userRepository = this.repository;
  }

  override async findAll(
    query: PaginationQueryDto,
  ): Promise<TPaginatedData<User>> {
    return super.findAll(query, {});
  }

  override async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException({ message: `User with id ${id} not found` });
    return user;
  }

  override async create(dto: CreateUserDto): Promise<User> {
    try {
      const user = await this._prepareUserEntity(dto);
      const savedUser = await this.userRepository.save(user);
      return savedUser.toSafeObject() as User; // exclude password
    } catch (error) {
      this.handleDbError(error);
    }
  }

  private async _prepareUserEntity(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      email: dto.email,
      lastName: dto.lastName,
      firstName: dto.firstName,
      status: UserStatus.active,
    });
    await user.setPassword(dto.password); // encrypt password
    return user;
  }
}
