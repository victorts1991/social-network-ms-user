import { FirebaseAuthGuard } from './firebase-auth.guard';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../../auth.service';

describe('FirebaseAuthGuard', () => {
  let guard: FirebaseAuthGuard;
  let mockAuthService: Partial<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      verifyIdToken: jest.fn(),
    };

    guard = new FirebaseAuthGuard(mockAuthService as AuthService);
  });

  const mockContext = (authHeader?: string): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: authHeader,
          },
        }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if Authorization header is missing', async () => {
    const context = mockContext(undefined);

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if Authorization header is malformed', async () => {
    const context = mockContext('Token abc123');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is empty', async () => {
    const context = mockContext('Bearer ');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should call AuthService.verifyIdToken and attach decoded token to request.user', async () => {
    const fakeToken = 'fake-token';
    const decodedToken = { uid: 'user123', email: 'test@example.com' };
    (mockAuthService.verifyIdToken as jest.Mock).mockResolvedValue(decodedToken);

    const req: any = {
      headers: {
        authorization: `Bearer ${fakeToken}`,
      },
    };

    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as any;

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockAuthService.verifyIdToken).toHaveBeenCalledWith(fakeToken);
    expect(req.user).toEqual(decodedToken);
  });

  it('should throw UnauthorizedException if token verification fails', async () => {
    (mockAuthService.verifyIdToken as jest.Mock).mockRejectedValue(new Error('Invalid token'));

    const context = mockContext('Bearer invalid-token');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});
