import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { AppConfigService } from 'src/config/app-config.service';
import { MailService } from 'src/mail/mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { join } from 'path';
@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (appConfigService: AppConfigService) => {
        return {
          transport: {
            host: appConfigService.mailConfig.host,
            port: appConfigService.mailConfig.port,
            secure: appConfigService.mailConfig.secure,
            auth: {
              user: appConfigService.mailConfig.username,
              pass: appConfigService.mailConfig.password,
            },
          },
          defaults: {
            from: appConfigService.mailConfig.from,
          },
          template: {
            dir: join(__dirname, '/templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [AppConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
