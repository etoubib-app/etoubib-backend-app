import { ClientUserEntity, InvalidCredentialsException } from "@lib/shared";
import { Inject, Injectable, Scope, UnauthorizedException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ClientUserLoginDto, ClientUserLoginResponseDto } from "../dtos";
import { TClientJwtPayload } from "../types";
import { ClientUserMapper } from "../../users/users.client.mapper";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import { ExceptionErrorType } from "@lib/shared/types";
import { ClientUsersService } from "../../users/services";
import { CLIENT_CONNECTION, getTenantConnection, JWTAuthHelper } from "@lib/shared/modules";

@Injectable({ scope: Scope.REQUEST })
export class ClientAuthService {
    protected readonly clientUserRepository: Repository<ClientUserEntity>;

    constructor(
        @Inject(REQUEST) protected request: Request,
        protected readonly configService: ConfigService,
        @Inject(CLIENT_CONNECTION) connection: DataSource,
        protected readonly jwtAuthHelper: JWTAuthHelper<TClientJwtPayload>
    ) {
        this.clientUserRepository = connection.getRepository(ClientUserEntity);
    }

    async login({ email, password, remember_me }: ClientUserLoginDto): Promise<ClientUserLoginResponseDto> {
        const tenantId = this.request.headers['x-tenant-id']
        if (!tenantId)
            throw new UnauthorizedException({
                error_code: ExceptionErrorType.TenantIsRequired,
                message: "Tenant ID must be provided",
            });;

        const user = await this.clientUserRepository.findOneBy({ email });
        if (!user) throw new InvalidCredentialsException();

        const passwordMatched = await user.checkPassword(password);
        if (!passwordMatched) throw new InvalidCredentialsException();

        const tenantConnection = await getTenantConnection(tenantId);
        const clientUserService = new ClientUsersService(tenantConnection)
        clientUserService.checkUserStatus(user)

        // generate token
        const secret = this.configService.getOrThrow<string>('jwt.client.secret')
        const expiresIn = remember_me ?
            this.configService.getOrThrow<string>('jwt.client.remember_expires_in') :
            this.configService.getOrThrow<string>('jwt.client.expires_in');
        const payload: TClientJwtPayload = { userId: user.id, tenantId };
        const token = this.jwtAuthHelper.generateAccessToken({ payload, secret: secret!, expiresIn: expiresIn! });

        const clientUserMapper = new ClientUserMapper()
        const userDto = clientUserMapper.toDtoWithRelations(user)
        return { user: userDto, tokens: { accessToken: token } };
    }
}
