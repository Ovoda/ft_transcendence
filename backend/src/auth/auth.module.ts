import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { configService } from 'src/app/config/config.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtStrategy } from './strategies/ft.auth.strategy';
import { JwtStrategy } from './strategies/jwt.auth.strategy';
import { TfaStrategy } from './strategies/tfa.auth.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: configService.getJwtTokenSecret(),
      signOptions: { expiresIn: '6h' },
    })
  ],
  providers: [AuthService, JwtStrategy, FtStrategy, TfaStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
