import { Module } from '@nestjs/common';

import { CONNECTION } from '../../constants/app.constant';
import { DatabaseModule } from '../../tenancy/database.module';
import { CoreUsersController } from './users.core.controller';
import { CoreUsersService } from './users.core.service';

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
