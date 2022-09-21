import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { AppLoggerService } from 'src/logger/logger.service';

@Injectable()
export class MailService {
  mail: MailerService;
  private logger: AppLoggerService;

  constructor(private readonly mailerService: MailerService) {
    this.logger = new AppLoggerService(MailService.name);
    this.mail = mailerService;
    this.logger.log(`Mail service initialized`);
  }

  async sendMailConfirm(to: string, link: string) {
    await this.mail.sendMail({
      to,
      subject: 'Verify registration on EStudies',
      template: 'confirm_registration',
      context: {
        link,
        brand_url: 'https://estudies.com',
      },
    });
  }
}
