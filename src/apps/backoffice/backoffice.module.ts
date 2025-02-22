import { Module } from '@nestjs/common';
import { ClinicsModule } from './modules/clinics/clinics.module';

@Module({
  imports: [ClinicsModule],
})
export class BackofficeModule {}
