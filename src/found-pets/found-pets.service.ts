import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoundPet } from './found-pet.entity';
import { Repository } from 'typeorm';
import { CreateFoundPetDto } from 'src/lost-pets/dto/create-found-pet.dto';

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,
  ) {}

  async create(createFoundPetDto: CreateFoundPetDto): Promise<FoundPet> {
    const foundPet = this.foundPetRepository.create({
      species: createFoundPetDto.species,
      breed: createFoundPetDto.breed ?? null,
      color: createFoundPetDto.color,
      size: createFoundPetDto.size,
      description: createFoundPetDto.description,
      photoUrl: createFoundPetDto.photoUrl ?? null,
      finderName: createFoundPetDto.finderName,
      finderEmail: createFoundPetDto.finderEmail,
      finderPhone: createFoundPetDto.finderPhone,
      address: createFoundPetDto.address,
      foundDate: new Date(createFoundPetDto.foundDate),
      location: {
        type: 'Point',
        coordinates: [createFoundPetDto.lng, createFoundPetDto.lat],
      },
    });
    return await this.foundPetRepository.save(foundPet);
  }
}
