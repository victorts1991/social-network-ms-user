import { IsString, IsOptional, MaxLength, IsDateString, ValidateNested, isString } from 'class-validator';
import { AddressDto } from './address.dto';
import { Type } from 'class-transformer';

export class UpdateUserDto {

  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'O sobrenome deve ser uma string.' })
  @MaxLength(100, { message: 'O sobrenome deve ter no máximo 100 caracteres.' })
  surname?: string;

  @IsOptional()
  @IsDateString({}, { message: 'A data de nascimento deve estar em um formato de data válido (ex: AAAA-MM-DD).' })
  birthDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @IsString()
  photoFrontIdentity?: string

  @IsOptional()
  @IsString()
  photoBackIdentity?: string

}