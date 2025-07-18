import { ClientController } from '@lib/shared';
import { ApiResponseWithData } from '@lib/shared/decorators';
import {
  CreateUserDto,
  UserResponseDto,
  PaginationQueryDto,
} from '@lib/shared/dto';
import { JwtAuthGuard } from '@lib/shared/modules/jwt-auth';
import {
  Body,
  Get,
  HttpStatus,
  Injectable,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { ApiConflictResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserApiService } from './services';

@ApiTags('Client users')
@UseGuards(JwtAuthGuard)
@Injectable({ scope: Scope.REQUEST })
@ClientController('users')
export class UserController {
  constructor(private readonly userApiService: UserApiService) {}

  @Get()
  @ApiOperation({ description: 'Get all clinic users' })
  @ApiResponseWithData(UserResponseDto, { isArray: true })
  findAll(@Query() query: PaginationQueryDto) {
    return this.userApiService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get user by id' })
  @ApiResponseWithData(UserResponseDto)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userApiService.findOne(id);
  }

  @Post()
  @ApiOperation({ description: 'Create new user' })
  @ApiResponseWithData(UserResponseDto, { status: HttpStatus.CREATED })
  @ApiConflictResponse({ description: 'User already exists' })
  create(@Body() dto: CreateUserDto) {
    return this.userApiService.create(dto);
  }
}
