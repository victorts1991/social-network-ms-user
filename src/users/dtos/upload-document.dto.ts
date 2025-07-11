import { IsString, IsNotEmpty } from 'class-validator';

export class UploadDocumentDto {
  @IsString({ message: 'O tipo do documento deve ser uma string.' })
  @IsNotEmpty({ message: 'O tipo do documento não pode estar vazio.' })
  documentType: string; // Ex: 'RG', 'CPF', 'CNH_FRENTE', 'CNH_VERSO'

  // O arquivo em si será injetado pelo @UploadedFile() no controller,
  // então não é uma propriedade direta neste DTO para validação.
}