import { Injectable } from '@nestjs/common';
import { LostPet } from './lost-pet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
import { RedisCacheService } from '../cache/redis-cache.service';

const LOST_PETS_CACHE_KEY = 'lost-pets:active';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
    private readonly cacheService: RedisCacheService,
  ) {}

  async findActive(): Promise<LostPet[]> {
    const cachedLostPets = await this.cacheService.get<LostPet[]>(LOST_PETS_CACHE_KEY);

    if (cachedLostPets) {
      return cachedLostPets;
    }

    const lostPets = await this.lostPetRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    await this.cacheService.set(LOST_PETS_CACHE_KEY, lostPets);

    return lostPets;
  }

  async create(createLostPetDto: CreateLostPetDto): Promise<LostPet> {
    const lostPet = this.lostPetRepository.create({
      name: createLostPetDto.name,
      species: createLostPetDto.species,
      breed: createLostPetDto.breed,
      color: createLostPetDto.color,
      size: createLostPetDto.size,
      description: createLostPetDto.description,
      photoUrl: createLostPetDto.photoUrl ?? null,
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

    const savedLostPet = await this.lostPetRepository.save(lostPet);
    await this.cacheService.del(LOST_PETS_CACHE_KEY);

    return savedLostPet;
  }
}
