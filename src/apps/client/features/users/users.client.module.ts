import { Module } from '@nestjs/common';

import { CONNECTION } from '../../constants/app.constant';
import { DatabaseModule } from '../../modules/database/database.module';
import { ClientUsersController } from './users.client.controller';
import { ClientUsersService } from './users.client.service';

@Module({
  imports: [DatabaseModule], // Import ClientModule here
  controllers: [ClientUsersController],
  providers: [
    {
      provide: 'ClientUsersServiceKey', // a symbol
      useFactory: (ccs: ClientUsersService) => {
        return Promise.resolve(ccs);
      },
      inject: [ClientUsersService, CONNECTION],
    },
    ClientUsersService,
  ],
})
export class ClientUsersModule {}
