import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as admin from 'firebase-admin';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

const mockFirestore = {
  collection: jest.fn(),
};

const mockCollection = {
  where: jest.fn(),
  add: jest.fn(),
  doc: jest.fn(),
};

const mockDocRef = {
  id: 'userId123',
  update: jest.fn(),
  get: jest.fn(),
};

const mockQuerySnapshot = {
  empty: false,
  docs: [
    {
      id: 'userId123',
      data: jest.fn(() => ({
        firebaseUid: 'firebaseUid123',
        email: 'test@example.com',
        name: 'Test',
        surname: 'User',
        birthDate: '1990-01-01',
        isDocumentVerified: false,
        address: {
          cep: '12345-678',
          street: 'Rua Teste',
          number: '123',
          city: 'São Paulo',
          state: 'SP',
          complement: 'Apto 1',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    },
  ],
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'FIREBASE_ADMIN',
          useValue: {
            firestore: jest.fn(() => mockFirestore),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Mocking nested calls
    mockFirestore.collection.mockReturnValue(mockCollection);
    mockCollection.where.mockReturnValue({
      limit: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(mockQuerySnapshot),
      }),
    });
    mockCollection.add.mockResolvedValue(mockDocRef);
    mockCollection.doc.mockReturnValue(mockDocRef);
    mockDocRef.get.mockResolvedValue(mockQuerySnapshot.docs[0]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByFirebaseUid', () => {
    it('should return a user entity when found', async () => {
      const user = await service.findOneByFirebaseUid('firebaseUid123');
      expect(user).toBeDefined();
      expect(user?.firebaseUid).toBe('firebaseUid123');
    });

    it('should return undefined if user not found', async () => {
      const emptySnapshot = { empty: true, docs: [] };
      mockCollection.where.mockReturnValue({
        limit: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(emptySnapshot),
        }),
      });

      const user = await service.findOneByFirebaseUid('nonexistent');
      expect(user).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const dto: CreateUserDto = {
        firebaseUid: 'firebaseUid123',
        email: 'test@example.com',
        name: 'Test',
        surname: 'User',
        birthDate: '1990-01-01',
        address: {
          cep: '12345-678',
          street: 'Rua Teste',
          number: '123',
          city: 'São Paulo',
          state: 'SP',
          complement: 'Apto 1',
        },
      };

      const user = await service.create(dto);
      expect(user).toBeDefined();
      expect(user.firebaseUid).toBe(dto.firebaseUid);
    });
  });

  describe('update', () => {
    it('should update and return the updated user', async () => {
      const dto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const user = await service.update('firebaseUid123', dto);
      expect(user).toBeDefined();
      expect(user.name).toBe('Test'); // O nome real vem do mock
      expect(mockDocRef.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockCollection.where.mockReturnValue({
        limit: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ empty: true, docs: [] }),
        }),
      });

      await expect(
        service.update('nonexistent', { name: 'Nope' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateDocumentVerificationStatus', () => {
    it('should update the verification status', async () => {
      const user = await service.updateDocumentVerificationStatus('firebaseUid123', true);
      expect(user).toBeDefined();
      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({ isDocumentVerified: true }),
      );
    });
  });
});
