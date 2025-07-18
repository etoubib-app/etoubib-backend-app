import {
  ApiResponseWithData,
  ClientController,
  GetAuthUser,
} from '@lib/shared';
import {
  UserLoginResponseDto,
  UserResponseDto,
  UserLoginDto,
  ClientUserLoginResponseDto,
} from '@lib/shared/dto';
import { AuthService } from '@lib/shared/modules/auth/auth.service';
import { getTenantId } from '@lib/shared/modules/auth/decorators/tenant.decorator';
import { JwtAuthGuard } from '@lib/shared/modules/jwt-auth';
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

@ApiTags('Client auth')
@Injectable()
@ClientController('auth')
export class AuthController {
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

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Clinic authenticated user' })
  @ApiResponseWithData(UserResponseDto)
  @Get('me')
  me(@GetAuthUser() user: UserResponseDto) {
    return { user };
  }
}
