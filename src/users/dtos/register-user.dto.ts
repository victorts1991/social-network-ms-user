import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer'; 
import { AddressDto } from './address.dto';

export class RegisterUserDto {
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  @IsString({ message: 'O e-mail deve ser uma string.' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @MaxLength(30, { message: 'A senha deve ter no máximo 30 caracteres.' })
  password: string;

  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'O sobrenome deve ser uma string.' })
  @MaxLength(100, { message: 'O sobrenome deve ter no máximo 100 caracteres.' })
  surname?: string;

  @IsOptional()
  //@IsDateString({ strict: true } as any, { message: 'A data de nascimento deve estar em um formato de data válido (ex: AAAA-MM-DD).' })
  //@Type(() => Date) 
  birthDate?: string; 

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}