import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { setupFirebaseAdmin } from './config/firebase.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule)
  ],
  controllers: [],
  providers: [
    {
      provide: 'FIREBASE_ADMIN', 
      useFactory: (configService: ConfigService) => setupFirebaseAdmin(configService),
      inject: [ConfigService],
    },
  ],
  exports: ['FIREBASE_ADMIN'], 
})

export class AppModule {}

