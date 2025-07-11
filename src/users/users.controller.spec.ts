import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UnauthorizedException } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth/firebase-auth.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      findOneByFirebaseUid: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    })
      .overrideGuard(FirebaseAuthGuard) // 👈 Aqui a mágica
      .useValue({ canActivate: jest.fn().mockReturnValue(true) }) // mocka o guard
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('getMe', () => {
    it('should return user data when UID is valid', async () => {
      const mockUser = { id: '123', name: 'John Doe', firebaseUid: 'abc123' };
      (usersService.findOneByFirebaseUid as jest.Mock).mockResolvedValue(mockUser);

      const req = { user: { uid: 'abc123' } } as any;

      const result = await controller.getMe(req);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if UID is missing', async () => {
      const req = { user: {} } as any;
      await expect(controller.getMe(req)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateMe', () => {
    it('should update and return updated user', async () => {
      const updateDto = { name: 'Updated' };
      const updatedUser = { id: '123', firebaseUid: 'abc123', name: 'Updated' };

      (usersService.update as jest.Mock).mockResolvedValue(updatedUser);

      const req = { user: { uid: 'abc123' } } as any;

      const result = await controller.updateMe(updateDto, req);
      expect(result).toEqual(updatedUser);
    });

    it('should throw UnauthorizedException if UID is missing', async () => {
      const updateDto = { name: 'Should fail' };
      const req = { user: {} } as any;
      await expect(controller.updateMe(updateDto, req)).rejects.toThrow(UnauthorizedException);
    });
  });
});
