import { ClientController } from '@lib/shared';
import { Get, Injectable, Param, Scope } from '@nestjs/common';

import { ClientUsersService } from './users.client.service';

@Injectable({ scope: Scope.REQUEST })
@ClientController('clinics')
export class ClientUsersController {
  constructor(private readonly clientUsersService: ClientUsersService) {}

  @Get()
  findAll() {
    return this.clientUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientUsersService.findOne(id);
  }
}
