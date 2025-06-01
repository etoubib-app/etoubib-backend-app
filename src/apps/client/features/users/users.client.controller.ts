import { ClientController } from '@lib/shared';
import { ApiResponseWithData } from '@lib/shared/decorators';
import { ClientCreateUserDto, ClientUserResponseDto } from '@lib/shared/dto';
import { ClientJwtAuthGuard } from '@lib/shared/modules/jwt-auth';
import { Body, Get, Injectable, Post, Scope, UseGuards } from '@nestjs/common';
import { ApiConflictResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ClientUsersApiService } from './services';

@ApiTags('Client Users')
@UseGuards(ClientJwtAuthGuard)
@Injectable({ scope: Scope.REQUEST })
@ClientController('users')
export class ClientUserController {
  constructor(private readonly clientUsersApiService: ClientUsersApiService) {}

  @ApiOperation({ description: 'Clinic users list' })
  @ApiResponseWithData(ClientUserResponseDto, { isArray: true })
  @Get()
  public getUsers() {
    return this.clientUsersApiService.getUsers('toDto');
  }

  @ApiOperation({ description: 'Create new clinic user' })
  @ApiResponseWithData(ClientUserResponseDto, { status: 201 })
  @ApiConflictResponse({ description: 'User already exists' })
  @Post()
  public createUser(@Body() UserDto: ClientCreateUserDto) {
    return this.clientUsersApiService.createUser(UserDto, 'toDto');
  }
}
