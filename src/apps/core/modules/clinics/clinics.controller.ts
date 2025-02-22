import { Get, Param } from '@nestjs/common';
import { CoreClinicsService } from './clinics.service';
import { CoreController } from '../../../../../src/shared/helpers';

@CoreController('clinics')
export class CoreClinicsController {
  constructor(private readonly coreClinicsService: CoreClinicsService) {}

  @Get()
  findAll() {
    return this.coreClinicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coreClinicsService.findOne(+id);
  }
}
