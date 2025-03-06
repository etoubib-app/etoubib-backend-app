import { Injectable } from '@nestjs/common';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Clinic } from '@lib/shared';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private repository: Repository<Clinic>,
  ) {}

  create(createClinicDto: CreateClinicDto) {
    return 'This action adds a new clinic';
  }

  findAll() {
    return this.repository.find();
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
