import { Module } from '@nestjs/common';

import { CoreUsersModule } from './modules/users/users.core.module';

@Module({
  imports: [CoreUsersModule],
})
export class CoreModule {}
