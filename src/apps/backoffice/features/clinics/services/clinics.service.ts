import { BoClinic, logcall, sanitizeDatabaseSchema } from '@lib/shared';
import { CLINIC_REPOSITORY_TOKEN } from '@lib/shared/modules';
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateClinicDto } from '../dto/create-clinic.dto';
import { UpdateClinicDto } from '../dto/update-clinic.dto';

@Injectable()
export class ClinicsService {
  private readonly logger = new Logger(ClinicsService.name);

  constructor(
    @Inject(CLINIC_REPOSITORY_TOKEN)
    private readonly clinicsRepository: Repository<BoClinic>,
  ) {}

  @logcall()
  async create(createClinicDto: CreateClinicDto) {
    const { name, email } = createClinicDto;
    try {
      const clinic = await this.clinicsRepository.manager.transaction(
        async (manager) => {
          const existingClinic = await manager.findOne(BoClinic, {
            where: { name },
          });
          if (existingClinic) {
            throw new ConflictException(
              `Clinic with name "${name}" already exists.`,
            );
          }
          // validate clinic tenant_id
          sanitizeDatabaseSchema(name);
          // Create a new clinic entity.
          const clinicCreator = manager.create(BoClinic, {
            name,
            email,
            status: 'draft',
          });

          // Save the clinic; save() returns the saved entity including createdAt.
          const clinic = await manager.save(clinicCreator);
          return clinic;
        },
      );
      clinic.status = 'pending';
      clinic.stage = 'ready_for_initialization';
      const clinicOnInit = await this.clinicsRepository.save(clinic);
      return clinicOnInit;
    } catch (error: unknown) {
      if ((error as { code?: string }).code === '23505') {
        // PostgreSQL unique constraint error
        throw new ConflictException(
          `Clinic with provided name "${name}" already exists.`,
        );
      }

      // Re-throw other known exceptions
      if (
        error instanceof ConflictException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      // Handle other unexpected errors
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Unexpected error: ${error.message}`,
        );
      }

      throw new InternalServerErrorException('Unexpected error occurred.');
    }
  }

  findAll() {
    return this.clinicsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} clinic`;
  }

  update(id: number, updateClinicDto: UpdateClinicDto) {
    return `This action updates a #${id} clinic`;
  }

  remove(id: number) {
    return `This action removes a #${id} clinic`;
  }
}
