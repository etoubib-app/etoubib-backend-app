import { Module } from '@nestjs/common';
import { CoreClinicsModule } from './modules/clinics/clinics.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule, CoreClinicsModule],
})
export class CoreModule {}
