import { IsDefined, IsEmail, IsString, Matches } from 'class-validator';

export class UserDto {
  @IsString({ message: 'Voornaam moet van het type string zijn!' })
  @IsDefined({ message: 'Voornaam is verplicht!' })
  firstname: string;

  @IsString({ message: 'Achternaam moet van het type string zijn!' })
  @IsDefined({ message: 'Achternaam is verplicht!' })
  lastname: string;

  @IsEmail()
  @IsString({ message: 'E-mailadres moet van het type string zijn!!' })
  @IsDefined({ message: 'E-mailadres is verplicht!' })
  emailAddress: string;

  @IsString({ message: 'Wachtwoord moet van het type string zijn!' })
  @IsDefined({ message: 'Wachtwoord is verplicht!' })
  @Matches(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'), {
    message:
      'Het wachtwoord is niet sterk genoeg! Het moet op zijn minst bestaan uit: 8 karakters, 1 hoofdletter, 1 kleine letter and 1 getal!',
  })
  password: string;
}
