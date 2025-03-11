import { Module } from '@nestjs/common';

import { ClinicsModule } from './features/clinics/clinics.module';

@Module({
  imports: [ClinicsModule],
})
export class BackofficeModule {}
