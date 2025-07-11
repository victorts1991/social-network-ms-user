import { IsString, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddressDto {
  @IsString({ message: 'O CEP deve ser uma string.' })
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  // Regex para formato XXXXX-XXX. O Transform remove não-dígitos antes
  @Matches(/^\d{5}-\d{3}$/, { message: 'O CEP deve estar no formato XXXXX-XXX.' })
  @Transform(({ value }) => value ? value.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2') : value)
  cep: string;

  @IsString({ message: 'A rua/avenida deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo Endereço é obrigatório.' })
  street: string;

  @IsString({ message: 'O número deve ser uma string.' })
  @IsNotEmpty({ message: 'O número é obrigatório.' })
  number: string;

  @IsString({ message: 'A cidade deve ser uma string.' })
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  city: string;

  @IsString({ message: 'O estado deve ser uma string.' })
  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  @Length(2, 2, { message: 'O estado deve ter 2 caracteres (sigla, ex: SP).' })
  state: string;

  @IsOptional()
  @IsString({ message: 'O complemento deve ser uma string.' })
  complement?: string;
}