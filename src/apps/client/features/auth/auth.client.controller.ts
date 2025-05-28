import {
  ApiResponseWithData,
  ClientController,
  GetAuthUser,
} from '@lib/shared';
import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
  Scope,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ClientAuthService } from './services/auth.client.service';
import { ClientUserLoginDto } from './dtos/user-login.client.dto';
import { ClientJwtAuthGuard } from './guards/jwt-auth.client.guard';
import { ClientUserWithRelationsResponseDto } from '../users/dtos';
import { ClientUserLoginResponseDto } from './dtos';

@ApiTags('Client Auth')
@Injectable({ scope: Scope.REQUEST })
@ClientController('auth')
export class ClientAuthController {
  constructor(private authService: ClientAuthService) {}

  @ApiOperation({ description: 'Clinic user authenticate' })
  @ApiResponseWithData(ClientUserLoginResponseDto)
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(
    @Body() userLoginDto: ClientUserLoginDto,
  ): Promise<ClientUserLoginResponseDto> {
    return this.authService.login(userLoginDto);
  }

  @UseGuards(ClientJwtAuthGuard)
  @ApiOperation({ description: 'Clinic authenticated user' })
  @ApiResponseWithData(ClientUserWithRelationsResponseDto)
  @Get('me')
  me(@GetAuthUser() user: ClientUserWithRelationsResponseDto) {
    return { user };
  }
}
