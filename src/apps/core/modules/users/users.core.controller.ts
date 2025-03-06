import { CoreController } from '@lib/shared';
import { Get, Injectable, Param, Scope } from '@nestjs/common';

import { CoreUsersService } from './users.core.service';

@Injectable({ scope: Scope.REQUEST })
@CoreController('clinics')
export class CoreUsersController {
  constructor(private readonly coreUsersService: CoreUsersService) {}

  @Get()
  findAll() {
    return this.coreUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coreUsersService.findOne(id);
  }
}
