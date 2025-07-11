import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AppModule } from '../app.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AppModule), 
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], 
})
export class UsersModule {}

