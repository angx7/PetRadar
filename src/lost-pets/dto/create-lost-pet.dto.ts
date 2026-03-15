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

export class CreateLostPetDto {
  @IsString()
  name!: string;

  @IsString()
  species!: string;

  @IsString()
  breed!: string;

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
  ownerName!: string;

  @IsEmail()
  ownerEmail!: string;

  @IsString()
  ownerPhone!: string;

  @IsString()
  address!: string;

  @IsDateString()
  lostDate!: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng!: number;
}
