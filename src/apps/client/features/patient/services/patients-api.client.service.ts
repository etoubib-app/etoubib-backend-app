import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CLIENT_CONNECTION } from '@lib/shared/modules';
import { DataSource, Repository } from 'typeorm';
import { SoftDeleteBaseService } from '@lib/shared/base/services/soft-delete-base.service';
import { CreatePatientDto, UpdatePatientDto } from '../dtos';
import { AddressEntity, PatientEntity } from '@lib/shared';

@Injectable({ scope: Scope.REQUEST })
export class PatientsApiService extends SoftDeleteBaseService<PatientEntity> {
  protected readonly addressRepository: Repository<AddressEntity>;
  protected readonly patientRepository: Repository<PatientEntity>;

  constructor(@Inject(CLIENT_CONNECTION) protected connection: DataSource) {
    super(connection.getRepository(PatientEntity));
    this.addressRepository = connection.getRepository(AddressEntity);
    this.patientRepository = this.repository
  }

  override async create(dto: CreatePatientDto): Promise<PatientEntity> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let address: AddressEntity | null = null;
      if (dto.address) {
        address = queryRunner.manager.create(AddressEntity, dto.address);
        await queryRunner.manager.save(address);
      }
      if (dto.address_id) {
        address = await queryRunner.manager.findOneBy(AddressEntity, { id: dto.address_id });
        if (!address) throw new NotFoundException(`Address with id ${dto.address_id} not found`);
      }

      const patient = queryRunner.manager.create(PatientEntity, {
        ...dto,
        ...(address ? { address } : {}),
      });
      const savedPatient = await queryRunner.manager.save(patient);

      await queryRunner.commitTransaction();
      return savedPatient;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDbError(error);
    } finally {
      await queryRunner.release();
    }
  }

  override async update(id: string, dto: UpdatePatientDto): Promise<PatientEntity> {
    try {
      const patient = await this.patientRepository.findOneByOrFail({ id });
      if (dto.address_id) {
        const existingAddress = await this.addressRepository.findOneBy({ id: dto.address_id });
        if (!existingAddress) throw new NotFoundException({ message: `Address with id ${dto.address_id} not found` });
        patient.address = existingAddress;
      }

      Object.assign(patient, dto);
      return await this.patientRepository.save(patient);
    } catch (error) {
      this.handleDbError(error);
    }
  }
}
