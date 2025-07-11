import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { Request } from 'express'; 

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {} // Injete seu AuthService

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>(); // Obtém o objeto Request
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Guard: Cabeçalho Authorization não encontrado ou mal formatado (Bearer token).');
      throw new UnauthorizedException('Token de autenticação não fornecido ou mal formatado.');
    }

    const idToken = authHeader.split(' ')[1]; // Extrai a string do token (ex: "Bearer <token>" -> "<token>")

    if (!idToken) {
      console.error('Guard: ID Token não encontrado no cabeçalho.');
      throw new UnauthorizedException('Token de autenticação vazio.');
    }

    console.log('Guard: Token JWT bruto recebido para validação:', idToken);

    try {
      // Delega a verificação do token ao AuthService (que usa o Firebase Admin SDK)
      const decodedToken = await this.authService.verifyIdToken(idToken);
      console.log('Guard: Token decodificado com sucesso pelo Firebase:', decodedToken);

      // Anexa o payload decodificado ao objeto 'request.user'
      // para que ele possa ser acessado pelos controllers (ex: req.user.uid)
      request.user = decodedToken; 
      
      return true; // Permite que a requisição prossiga
    } catch (error) {
      // Captura o erro da verificação do token (expirado, inválido, etc.)
      console.error('Guard: Erro de validação de token Firebase:', error.message);
      throw new UnauthorizedException('Token de autenticação inválido ou expirado.');
    }
  }
}