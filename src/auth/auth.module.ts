// src/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AppModule } from '../app.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseAuthGuard } from './guards/firebase-auth/firebase-auth.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => AppModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FirebaseAuthGuard,
  ],
  exports: [
    AuthService,
    FirebaseAuthGuard, 
  ],
})
export class AuthModule {}