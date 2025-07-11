// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, Request, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dtos/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

}