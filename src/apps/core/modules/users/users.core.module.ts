import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../tenancy/database.module';
import { CoreUsersService } from './users.core.service';
import { CoreUsersController } from './users.core.controller';
import { CONNECTION } from '../../constants/app.constant';

@Module({
  imports: [DatabaseModule], // Import CoreModule here
  controllers: [CoreUsersController],
  providers: [
    {
      provide: 'CoreUsersServiceKey', // a symbol
      useFactory: (ccs: CoreUsersService) => {
        return Promise.resolve(ccs);
      },
      inject: [CoreUsersService, CONNECTION],
    },
    CoreUsersService,
  ],
})
export class CoreUsersModule {}
