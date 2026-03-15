import { Body, Controller, Post } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import { CreateFoundPetDto } from 'src/found-pets/dto/create-found-pet.dto';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Post()
  create(@Body() createFoundPetDto: CreateFoundPetDto) {
    return this.foundPetsService.create(createFoundPetDto);
  }
}
