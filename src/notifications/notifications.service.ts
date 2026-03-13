import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  notify(): void {
    this.logger.log('Notifications service initialized.');
  }
}
