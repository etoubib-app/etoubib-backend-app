import { BoClinic } from '@lib/shared';
import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { ClinicEvent } from './events/clinic.event';

@Injectable()
export class ClinicsService {
  constructor(
    @Inject('ClinicRepositoryToken')
    private readonly ClinicsRepository: Repository<BoClinic>,
    @Inject(forwardRef(() => ClinicEvent))
    private readonly clinicEvent: ClinicEvent,
  ) { }

  async create(createClinicDto: CreateClinicDto) {
    const { name, email } = createClinicDto;
    let clinic: BoClinic = {} as BoClinic;
    try {
      await this.ClinicsRepository.manager.transaction(async (manager) => {
        const existingClinic = await manager.findOne(BoClinic, {
          where: { name },
        });
        if (existingClinic) {
          throw new ConflictException(
            `Clinic with name "${name}" already exists.`,
          );
        }
        // Create a new clinic entity.
        clinic = manager.create(BoClinic, {
          name,
          email,
        });

        // Save the clinic; save() returns the saved entity including createdAt.
        clinic = await manager.save(clinic);
        console.log('Clinic created:', clinic);

        if (!clinic || !clinic.id) {
          throw new InternalServerErrorException(
            'Failed to create clinic record.',
          );
        }
      });
      this.clinicEvent.emitMigrationStarted(clinic.id);
      // Emit an event to notify listeners that a clinic has been created.
      this.clinicEvent.emitClinicCreationUpdate(clinic.id);
      return clinic;
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
    return this.ClinicsRepository.find();
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
