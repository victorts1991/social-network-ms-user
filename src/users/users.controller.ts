import { Body, Request, Controller, HttpCode, HttpStatus, Put, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth/firebase-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    /**
     * Retorna os dados do perfil do usuário autenticado.
     * Requer autenticação via ID Token do Firebase.
     */
    @UseGuards(FirebaseAuthGuard) 
    @Get('me')
    async getMe(@Request() req: ExpressRequest) { 
        const firebaseUid = req.user?.uid;

        if (!firebaseUid) {
            throw new UnauthorizedException('UID do Firebase não encontrado no token de autenticação.');
        }

        console.log(`Requisição GET /users/me do usuário UID: ${firebaseUid}`);

        // Usa o UID do Firebase para buscar o perfil completo do usuário no Firestore
        return this.userService.findOneByFirebaseUid(firebaseUid);
    }

    /**
     * Atualiza os dados do perfil do usuário autenticado.
     * Requer autenticação via ID Token do Firebase.
     */
    @UseGuards(FirebaseAuthGuard) 
    @Put('') 
    @HttpCode(HttpStatus.OK)
    async updateMe(@Body() updateUserDto: UpdateUserDto, @Request() req: ExpressRequest) { 
        const firebaseUid = req.user?.uid;

        if (!firebaseUid) {
            throw new UnauthorizedException('UID do Firebase não encontrado no token de autenticação.');
        }

        console.log(`Requisição PUT /users/me do usuário UID: ${firebaseUid}`);

        return this.userService.update(firebaseUid, updateUserDto);
    }
}