import { Injectable } from '@nestjs/common';
import { LostPet } from './lost-pet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
  ) {}

  async create(createLostPetDto: CreateLostPetDto): Promise<LostPet> {
    const lostPet = this.lostPetRepository.create({
      name: createLostPetDto.name,
      species: createLostPetDto.species,
      breed: createLostPetDto.breed,
      color: createLostPetDto.color,
      size: createLostPetDto.size,
      description: createLostPetDto.description,
      photoUrl: createLostPetDto.photoUrl,
      ownerName: createLostPetDto.ownerName,
      ownerEmail: createLostPetDto.ownerEmail,
      ownerPhone: createLostPetDto.ownerPhone,
      address: createLostPetDto.address,
      lostDate: new Date(createLostPetDto.lostDate),
      isActive: true,
      location: {
        type: 'Point',
        coordinates: [createLostPetDto.lng, createLostPetDto.lat],
      },
    });
    return await this.lostPetRepository.save(lostPet);
  }
}
