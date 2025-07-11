import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from '../users/dtos/register-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let mockFirebaseAdmin: any;
  let mockUsersService: Partial<UsersService>;

  beforeEach(() => {
    mockFirebaseAdmin = {
      auth: jest.fn().mockReturnValue({
        createUser: jest.fn(),
        verifyIdToken: jest.fn(),
      }),
    };

    mockUsersService = {
      create: jest.fn(),
    };

    service = new AuthService(mockFirebaseAdmin, mockUsersService as UsersService);
  });

  describe('register', () => {
    it('should register user with Firebase and create profile', async () => {
      const dto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'pass123',
        name: 'John',
        surname: 'Doe',
        birthDate: '1990-01-01',
      };

      const userRecord = { uid: 'uid123', email: dto.email };
      const userProfile = { id: 'profileId123', ...dto };

      mockFirebaseAdmin.auth().createUser.mockResolvedValue(userRecord);
      (mockUsersService.create as jest.Mock).mockResolvedValue(userProfile);

      const result = await service.register(dto);

      expect(result).toEqual({
        uid: 'uid123',
        email: dto.email,
        profile: userProfile,
      });

      expect(mockFirebaseAdmin.auth().createUser).toHaveBeenCalledWith({
        email: dto.email,
        password: dto.password,
      });

      expect(mockUsersService.create).toHaveBeenCalledWith({
        firebaseUid: 'uid123',
        email: dto.email,
        name: dto.name,
        surname: dto.surname,
        birthDate: dto.birthDate,
      });
    });

    it('should throw BadRequestException on error', async () => {
      mockFirebaseAdmin.auth().createUser.mockRejectedValue(new Error('Registration error'));

      await expect(service.register({
        email: 'fail@example.com',
        password: '123',
        name: 'Fail',
        surname: 'User',
        birthDate: '1999-01-01',
      })).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyIdToken', () => {
    it('should return decoded token if valid', async () => {
      const decoded = { uid: 'uid123', email: 'user@example.com' };
      mockFirebaseAdmin.auth().verifyIdToken.mockResolvedValue(decoded);

      const result = await service.verifyIdToken('valid-token');
      expect(result).toEqual(decoded);
    });

    it('should throw UnauthorizedException if token invalid', async () => {
      mockFirebaseAdmin.auth().verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await expect(service.verifyIdToken('invalid-token')).rejects.toThrow(UnauthorizedException);
    });
  });
});
