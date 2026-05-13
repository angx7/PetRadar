import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoundPet } from './found-pet.entity';
import { Repository } from 'typeorm';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { LostPet } from '../lost-pets/lost-pet.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { LostPetMatch } from '../notifications/types/lost-pet-match.type';
import { RedisCacheService } from '../cache/redis-cache.service';

const FOUND_PETS_CACHE_KEY = 'found-pets:all';

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
    private readonly notificationsService: NotificationsService,
    private readonly cacheService: RedisCacheService,
  ) {}

  async findAll(): Promise<FoundPet[]> {
    const cachedFoundPets = await this.cacheService.get<FoundPet[]>(FOUND_PETS_CACHE_KEY);

    if (cachedFoundPets) {
      return cachedFoundPets;
    }

    const foundPets = await this.foundPetRepository.find({
      order: { createdAt: 'DESC' },
    });

    await this.cacheService.set(FOUND_PETS_CACHE_KEY, foundPets);

    return foundPets;
  }

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

    const savedFoundPet = await this.foundPetRepository.save(foundPet);
    const matches = await this.findNearbyLostPets(
      createFoundPetDto.lat,
      createFoundPetDto.lng,
    );

    await this.notificationsService.notifyFoundPet(savedFoundPet, matches);
    await this.cacheService.del(FOUND_PETS_CACHE_KEY);

    return savedFoundPet;
  }

  private async findNearbyLostPets(lat: number, lng: number): Promise<LostPetMatch[]> {
    return this.lostPetRepository.query(
      `
        SELECT
          id,
          name,
          species,
          breed,
          color,
          size,
          description,
          photo_url,
          owner_name,
          owner_email,
          owner_phone,
          address,
          lost_date,
          is_active,
          created_at,
          updated_at,
          ST_AsText(location) AS location,
          ST_Distance(
            location::geography,
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
          ) AS distance
        FROM lost_pets
        WHERE is_active = true
          AND ST_DWithin(
            location::geography,
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
            500
          )
        ORDER BY distance ASC;
      `,
      [lng, lat],
    );
  }
}
