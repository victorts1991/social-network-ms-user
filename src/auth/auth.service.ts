import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { RegisterUserDto } from '../users/dtos/register-user.dto';
import { UsersService } from '../users/users.service'; // Injeta o UsersService (que usa Firestore)

@Injectable()
export class AuthService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
    private readonly usersService: UsersService,  
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, name, surname, birthDate } = registerUserDto;
    try {
      // 1. Cria o usuário no Firebase Authentication
      const userRecord = await this.firebaseAdmin.auth().createUser({ email, password });

      // 2. Cria o perfil do usuário no seu banco de dados local (Firestore) via UsersService
      const userProfile = await this.usersService.create({
        firebaseUid: userRecord.uid,
        email: userRecord.email || email, // Usa o email do userRecord ou do DTO
        name,
        surname,
        birthDate,
      });

      return { uid: userRecord.uid, email: userRecord.email, profile: userProfile };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(idToken);
      return decodedToken; // Contém { uid, email, name }
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }

  
}