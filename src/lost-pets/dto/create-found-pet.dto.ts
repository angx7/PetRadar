import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class CreateFoundPetDto {
  @IsString()
  species!: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsString()
  color!: string;

  @IsString()
  size!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @IsString()
  finderName!: string;

  @IsEmail()
  finderEmail!: string;

  @IsString()
  finderPhone!: string;

  @IsString()
  address!: string;

  @IsDateString()
  foundDate!: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng!: number;
}
