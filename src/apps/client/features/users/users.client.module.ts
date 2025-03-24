import { CONNECTION, DatabaseClientModule } from '@lib/shared';
import { Module } from '@nestjs/common';

import { ClientUsersController } from './users.client.controller';
import { ClientUsersService } from './users.client.service';

@Module({
  imports: [DatabaseClientModule], // Import ClientModule here
  controllers: [ClientUsersController],
  providers: [
    {
      provide: 'ClientUsersServiceKey', // a symbol
      useFactory: (ccs: ClientUsersService) => {
        return Promise.resolve(ccs);
      },
      inject: [ClientUsersService, CONNECTION.CLIENT],
    },
    ClientUsersService,
  ],
})
export class ClientUsersModule {}
