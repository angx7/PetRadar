import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPet } from './found-pet.entity';
import { FoundPetsController } from './found-pets.controller';
import { FoundPetsService } from './found-pets.service';

@Module({
  imports: [TypeOrmModule.forFeature([FoundPet])],
  controllers: [FoundPetsController],
  providers: [FoundPetsService],
  exports: [FoundPetsService, TypeOrmModule],
})
export class FoundPetsModule {}
