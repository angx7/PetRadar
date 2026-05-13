import { Body, Controller, Get, Post } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Get()
  findAll() {
    return this.foundPetsService.findAll();
  }

  @Post()
  create(@Body() createFoundPetDto: CreateFoundPetDto) {
    return this.foundPetsService.create(createFoundPetDto);
  }
}
