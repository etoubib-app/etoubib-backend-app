
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ClientAuthController } from './auth.client.controller';
import { ClientAuthService } from './services/auth.client.service';
import { ClientJwtStrategy } from './strategies/jwt.client.strategy';
import { JWTAuthModule } from '@lib/shared/modules/jwt-auth/jwt-auth.module';
import { ClientUserModule } from '../users/users.client.module';
import { ClientDatabaseModule } from '@lib/shared/modules';

@Module({
    imports: [
        ConfigModule,
        ClientDatabaseModule,
        forwardRef(() => ClientUserModule),
        PassportModule.register({ defaultStrategy: "jwt" }),
        JWTAuthModule,
    ],
    controllers: [ClientAuthController],
    providers: [ClientJwtStrategy, ClientAuthService],
    exports: [ClientJwtStrategy, JWTAuthModule, ConfigModule]
})
export class ClientAuthModule { }