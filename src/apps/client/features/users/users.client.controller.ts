import { ClientController } from '@lib/shared';
import { Body, Get, Injectable, Post, Scope, UseGuards } from '@nestjs/common';

import { ClientUserService } from './services/users.client.service';
import { ApiConflictResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientCreateUserDto, ClientUserResponseDto } from './dtos';
import { ClientJwtAuthGuard } from '../auth/guards/jwt-auth.client.guard';
import { ApiResponseWithData } from '@lib/shared/decorators';

@ApiTags('Client Users')
@UseGuards(ClientJwtAuthGuard)
@Injectable({ scope: Scope.REQUEST })
@ClientController('users')
export class ClientUserController {
  constructor(private readonly clientUserService: ClientUserService) { }

  @ApiOperation({ description: 'Clinic users list' })
  @ApiResponseWithData(ClientUserResponseDto, { isArray: true })
  @Get()
  public getUsers() {
    return this.clientUserService.getUsers("toDto");
  }

  @ApiOperation({ description: 'Create new clinic user' })
  @ApiResponseWithData(ClientUserResponseDto, { status: 201 })
  @ApiConflictResponse({ description: 'User already exists' })
  @Post()
  public createUser(@Body() UserDto: ClientCreateUserDto) {
    return this.clientUserService.createUser(UserDto, "toDto");
  }
}
