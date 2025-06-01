import {
  ApiResponseWithData,
  ClientController,
  GetAuthUser,
} from '@lib/shared';
import {
  ClientUserLoginResponseDto,
  ClientUserWithRelationsResponseDto,
  UserLoginDto,
  UserLoginResponseDto,
} from '@lib/shared/dto';
import { AuthService } from '@lib/shared/modules/auth/auth.service';
import { getTenantId } from '@lib/shared/modules/auth/decorators/tenant.decorator';
import { ClientJwtAuthGuard } from '@lib/shared/modules/jwt-auth';
import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Client Auth')
@Injectable()
@ClientController('auth')
export class ClientAuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ description: 'Clinic user authenticate' })
  @ApiResponseWithData(UserLoginResponseDto)
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(
    @Body() userLoginDto: UserLoginDto,
    @getTenantId() tenantId: string,
  ): Promise<ClientUserLoginResponseDto> {
    return this.authService.clientLogin(userLoginDto, tenantId);
  }

  @UseGuards(ClientJwtAuthGuard)
  @ApiOperation({ description: 'Clinic authenticated user' })
  @ApiResponseWithData(ClientUserWithRelationsResponseDto)
  @Get('me')
  me(@GetAuthUser() user: ClientUserWithRelationsResponseDto) {
    return { user };
  }
}
