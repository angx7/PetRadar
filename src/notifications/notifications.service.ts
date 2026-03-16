import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { envs } from 'src/config/envs';
import { FoundPet } from 'src/found-pets/found-pet.entity';
import { generateFoundPetAlertTemplate } from './templates/found-pet-alert.template';
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

  async notifyFoundPet(foundPet: FoundPet, matches: LostPetMatch[]): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(
        'Skipping email delivery because MAILER_SERVICE, MAILER_EMAIL or MAILER_PASSWORD is missing.',
      );
      return;
    }

    if (matches.length) {
      for (const match of matches) {
        const html = generateFoundPetMatchTemplate(match, foundPet, envs.MAPBOX_TOKEN);

        try {
          await this.transporter.sendMail({
            from: envs.MAILER_EMAIL,
            to: match.owner_email,
            subject: `PetRadar: posible coincidencia para ${match.name}`,
            html,
          });
        } catch (error) {
          this.logger.error(
            `Failed to send match notification to ${match.owner_email}.`,
            error instanceof Error ? error.stack : undefined,
          );
        }
      }

      return;
    }

    if (!envs.ALERT_EMAIL) {
      this.logger.warn('Skipping generic alert delivery because ALERT_EMAIL is missing.');
      return;
    }

    try {
      await this.transporter.sendMail({
        from: envs.MAILER_EMAIL,
        to: envs.ALERT_EMAIL,
        subject: 'PetRadar: mascota encontrada sin coincidencias cercanas',
        html: generateFoundPetAlertTemplate(foundPet),
      });
    } catch (error) {
      this.logger.error(
        `Failed to send generic alert to ${envs.ALERT_EMAIL}.`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
