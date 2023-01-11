import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { environment } from 'apps/roots-api/src/environments/environment';
import { Public } from '../../auth/auth.module';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  @Public()
  async SendVerificationMail(
    email: string,
    receiverName: string,
    tokenId: string
  ) {
    await this.mailService.sendMail({
      to: email,
      from: environment.EMAIL_SENDINGEMAIL,
      subject: 'Roots | E-mailverificatie',
      html: `<div style="font-family: Helvetica, sans-serif"> <h1 style="font-weight: bold">Welkom bij Roots, ${receiverName}!</h1> <p style="padding-bottom: 15px">Door op de onderstaande knop te drukken wordt je account geverifieerd!</p> <a style=" background-color: #fba92c !important; border-color: #fba92c !important; border-width: 3px !important; border-radius: 0px !important; color: #ffffff !important; text-decoration: none; padding: 10px; " href="${
        environment.APPLICATION_URL + '/verification/' + tokenId
      }" > Account verifiëren </a> <p style="font-size: 11px; font-style: italic; margin-top: 15px">De link is voor de volgende 24 uur geldig.</p> <p style="font-size: 14px; margin-top: 25px">Groetjes het Roots-team</p> </div>`,
    });
  }
}
