import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPet } from './found-pet.entity';
import { LostPet } from 'src/lost-pets/lost-pet.entity';
import { FoundPetsController } from './found-pets.controller';
import { FoundPetsService } from './found-pets.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([FoundPet, LostPet]), NotificationsModule],
  controllers: [FoundPetsController],
  providers: [FoundPetsService],
  exports: [FoundPetsService, TypeOrmModule],
})
export class FoundPetsModule {}
