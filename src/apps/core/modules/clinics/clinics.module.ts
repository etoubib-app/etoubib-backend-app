import { Module } from '@nestjs/common';
import { CoreClinicsController } from './clinics.controller';
import { CoreClinicsService } from './clinics.service';
import { DatabaseModule } from '../../database.module';
import { CONNECTION } from 'src/constants/app.constant';

@Module({
  imports: [DatabaseModule], // Import CoreModule here
  controllers: [CoreClinicsController],
  providers: [
    {
      provide: 'CoreClinicsServiceKey', // a symbol
      useFactory: (ccs: CoreClinicsService) => {
        return Promise.resolve(ccs);
      },
      inject: [CoreClinicsService, CONNECTION],
    },
    CoreClinicsService,
  ],
})
export class CoreClinicsModule {}
