import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { envs } from 'src/config/envs';
import { FoundPet } from 'src/found-pets/found-pet.entity';
import { generateFoundPetMatchTemplate } from './templates/found-pet-match.template';
import { LostPetMatch } from './types/lost-pet-match.type';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly transporter =
    envs.MAILER_SERVICE && envs.MAILER_EMAIL && envs.MAILER_PASSWORD
      ? nodemailer.createTransport({
          service: envs.MAILER_SERVICE,
          auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_PASSWORD,
          },
        })
      : null;

  async sendFoundPetMatches(foundPet: FoundPet, matches: LostPetMatch[]): Promise<void> {
    if (!matches.length) {
      return;
    }

    if (!this.transporter || !envs.ALERT_EMAIL) {
      this.logger.warn(
        'Skipping email delivery because MAILER_SERVICE, MAILER_EMAIL, MAILER_PASSWORD or ALERT_EMAIL is missing.',
      );
      return;
    }

    for (const match of matches) {
      const html = generateFoundPetMatchTemplate(match, foundPet, envs.MAPBOX_TOKEN);

      await this.transporter.sendMail({
        from: envs.MAILER_EMAIL,
        to: envs.ALERT_EMAIL,
        subject: `PetRadar: posible coincidencia para ${match.name}`,
        html,
      });
    }
  }
}
