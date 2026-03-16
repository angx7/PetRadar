import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoundPet } from './found-pet.entity';
import { Repository } from 'typeorm';
import { CreateFoundPetDto } from 'src/found-pets/dto/create-found-pet.dto';
import { LostPet } from 'src/lost-pets/lost-pet.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { LostPetMatch } from 'src/notifications/types/lost-pet-match.type';

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
    private readonly notificationsService: NotificationsService,
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

    const savedFoundPet = await this.foundPetRepository.save(foundPet);
    const matches = await this.findNearbyLostPets(
      createFoundPetDto.lat,
      createFoundPetDto.lng,
    );

    await this.notificationsService.notifyFoundPet(savedFoundPet, matches);

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
