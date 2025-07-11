import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dtos/register-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
      verifyIdToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return profile info', async () => {
      const dto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John',
        surname: 'Doe',
        birthDate: '1990-01-01',
      };

      const mockResult = {
        uid: 'uid123',
        email: dto.email,
        profile: { id: 'abc123', ...dto },
      };

      (mockAuthService.register as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.register(dto);
      expect(result).toEqual(mockResult);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

});
