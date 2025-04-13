import { ClientUserEntity, InvalidCredentialsException } from "@lib/shared";
import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ClientUserLoginDto, ClientUserLoginResponseDto } from "../dtos";
import { TClientJwtPayload } from "../types";
import { ClientUserMapper } from "../../users/users.client.mapper";
import { JWTAuthHelper } from "@lib/shared/modules/jwt-auth/jwt-auth.helper";
import { ConfigService } from "@nestjs/config";
import { ClientUserService } from "../../users/services/users.client.service";
import { REQUEST } from "@nestjs/core";
import { ExceptionErrorType } from "@lib/shared/types";
import { CLIENT_CONNECTION } from "@lib/shared/modules";

@Injectable({ scope: Scope.REQUEST })
export class ClientAuthService {
    private readonly clientUserRepository: Repository<ClientUserEntity>;

    constructor(
        @Inject(REQUEST) private request: Request,
        private readonly configService: ConfigService,
        @Inject(CLIENT_CONNECTION) connection: DataSource,
        private readonly clientUserService: ClientUserService,
        private readonly jwtAuthHelper: JWTAuthHelper<TClientJwtPayload>
    ) {
        this.clientUserRepository = connection.getRepository(ClientUserEntity);
    }

    async login({ email, password, remember_me }: ClientUserLoginDto): Promise<ClientUserLoginResponseDto> {
        const tenantId = this.request.headers['x-tenant-id']
        if (!tenantId)
            throw new BadRequestException({
                error_code: ExceptionErrorType.TenantIsRequired,
                message: "Tenant ID must be provided",
            });;

        const user = await this.clientUserRepository.findOneBy({ email });
        if (!user) throw new InvalidCredentialsException();

        const passwordMatched = await user.checkPassword(password);
        if (!passwordMatched) throw new InvalidCredentialsException();

        // check user account status
        this.clientUserService.checkUserStatus(user)

        // generate token
        const secret = this.configService.getOrThrow<string>('JWT_AUTH_SECRET')
        const expiresIn = remember_me ?
            this.configService.getOrThrow<string>('REMEMBER_ME_ACCESS_TOKEN_EXPIRES_IN') :
            this.configService.getOrThrow<string>('ACCESS_TOKEN_EXPIRES_IN');
        const payload: TClientJwtPayload = { userId: user.id, tenantId };
        const token = this.jwtAuthHelper.generateAccessToken({ payload, secret: secret!, expiresIn: expiresIn! });

        const clientUserMapper = new ClientUserMapper()
        const userDto = clientUserMapper.toDtoWithRelations(user)
        return { user: userDto, tokens: { accessToken: token } };
    }
}
