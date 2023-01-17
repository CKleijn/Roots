import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { environment } from 'apps/roots-api/src/environments/environment';
import { Public } from '../../auth/auth.module';

@Injectable()
export class MailService {
  // Inject all dependencies
  constructor(private mailService: MailerService) {}

  // Send verification mail
  @Public()
  async SendVerificationMail(
    email: string,
    receiverName: string,
    verificationCode: string
  ) {
    await this.mailService.sendMail({
      to: email,
      from: environment.EMAIL_SENDINGEMAIL,
      subject: 'Roots | E-mailverificatie',
      html: `<div style="font-family: Helvetica, sans-serif"> <h1 style="font-weight: bold">Welkom bij Roots, ${receiverName}!</h1> <p>Gebruik de onderstaande code om je account te verifiëren.</p> <p style="font-size:24px; color: #1353d9; font-weight:900;">${verificationCode}</p> <p style="font-size: 11px; font-style: italic; margin-top: 15px">De code is voor de volgende 24 uur geldig.</p> <p style="font-size: 14px; margin-top: 25px">Groetjes het Roots-team</p> </div>`,
    });
  }

  // Send reset password mail
  @Public()
  async SendPasswordResetMail(
    email: string,
    receiverName: string,
    tokenId: string
  ) {
    const link = environment.APPLICATION_URL + '/password_reset/' + tokenId;

    await this.mailService.sendMail({
      to: email,
      from: environment.EMAIL_SENDINGEMAIL,
      subject: 'Roots | Wachtwoord resetten',
      html: `<div style="font-family: Helvetica, sans-serif"> <h1 style="font-weight: bold">Hallo ${receiverName}!</h1> <p style="padding-bottom:15px;">Druk op de onderstaande knop om je wachtwoord opnieuw in te stellen.</p> <a href="${link}" style="color: white; background: #1353d9; text-decoration: none; padding: 10px 28px;"> Wachtwoord instellen </a> <p style="font-size: 11px; font-style: italic; margin-top: 30px">De code is voor de volgende 24 uur geldig.</p> <p style="font-size: 14px; margin-top: 25px">Groetjes het Roots-team</p></div>`,
    });
  }
}
