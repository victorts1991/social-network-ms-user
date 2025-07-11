import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsBoolean, IsDateString, ValidateNested } from 'class-validator';
import { AddressDto } from './address.dto';

export class CreateUserDto {
  @IsString({ message: 'O UID do Firebase deve ser uma string.' })
  firebaseUid: string;

  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  email: string;

  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'O sobrenome deve ser uma string.' })
  surname?: string;

  @IsOptional()
  @IsDateString({}, { message: 'A data de nascimento deve estar em um formato de data válido (ex: AAAA-MM-DD).' })
  birthDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}