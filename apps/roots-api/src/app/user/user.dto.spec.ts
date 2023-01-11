import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserDto } from './user.dto';

describe('UserDto', () => {
  //firstname
  describe('firstname', () => {
    it('has not been given a value', async () => {
      const input = {
        lastname: 'lastname',
        emailAddress: 'test@gmail.com',
        password: 'r1reqHDP595FDRoKh0GG',
      };

      const model = plainToInstance(UserDto, input);

      const err = await validate(model);

      expect(err.length).not.toBe(0);
      expect(err[0].constraints.isDefined).toContain(`Voornaam is verplicht!`);
    });

    it('has an incorrect type', async () => {
      const input = {
        firstname: 0,
        lastname: 'lastname',
        emailAddress: 'test@gmail.com',
        password: 'r1reqHDP595FDRoKh0GG',
      };

      const model = plainToInstance(UserDto, input);

      const err = await validate(model);

      expect(err.length).not.toBe(0);
      expect(err[0].constraints.isString).toContain(
        `Voornaam moet van het type string zijn!`
      );
    });

    it('has correct input', async () => {
      const input = {
        firstname: 'firstname',
        lastname: 'lastname',
        emailAddress: 'test@gmail.com',
        password: 'r1reqHDP595FDRoKh0GG',
      };

      const model = plainToInstance(UserDto, input);
      const err = await validate(model);
      expect(err.length).toBe(0);
    });
  });

  //lastname
  describe('lastname', () => {
    it('has not been given a value', async () => {
      const input = {
        firstname: 'firstname',
        emailAddress: 'test@gmail.com',
        password: 'r1reqHDP595FDRoKh0GG',
      };

      const model = plainToInstance(UserDto, input);

      const err = await validate(model);

      expect(err.length).not.toBe(0);
      expect(err[0].constraints.isDefined).toContain(
        `Achternaam is verplicht!`
      );
    });

    it('has an incorrect type', async () => {
      const input = {
        firstname: 'firstname',
        lastname: 0,
        emailAddress: 'test@gmail.com',
        password: 'r1reqHDP595FDRoKh0GG',
      };

      const model = plainToInstance(UserDto, input);

      const err = await validate(model);

      expect(err.length).not.toBe(0);
      expect(err[0].constraints.isString).toContain(
        `Achternaam moet van het type string zijn!`
      );
    });

    it('has correct input', async () => {
      const input = {
        firstname: 'firstname',
        lastname: 'lastname',
        emailAddress: 'test@gmail.com',
        password: 'r1reqHDP595FDRoKh0GG',
      };

      const model = plainToInstance(UserDto, input);
      const err = await validate(model);
      expect(err.length).toBe(0);
    });
  });

  //emailaddress
  describe('emailAddress', () => {
    it('has not been given a value', async () => {
      const input = {
        firstname: 'firstname',
        lastname: 'lastname',
        password: 'r1reqHDP595FDRoKh0GG',
      };

      const model = plainToInstance(UserDto, input);

      const err = await validate(model);

      expect(err.length).not.toBe(0);
      expect(err[0].constraints.isDefined).toContain(
        `E-mailadres is verplicht!`
      );
    });

    it('has an incorrect type', async () => {
      const input = {
        firstname: 'firstname',
        lastname: 'lastname',
        emailAddress: 0,
        password: 'r1reqHDP595FDRoKh0GG',
      };

      const model = plainToInstance(UserDto, input);

      const err = await validate(model);

      expect(err.length).not.toBe(0);
      expect(err[0].constraints.isString).toContain(
        `E-mailadres moet van het type string zijn!`
      );
    });

    it('has an invalid value (email invalid structure)', async () => {
      const input = {
        firstname: 'firstname',
        lastname: 'lastname',
        emailAddress: 'email',
        password: 'r1reqHDP595FDRoKh0GG',
      };

      const model = plainToInstance(UserDto, input);

      const err = await validate(model);

      expect(err.length).not.toBe(0);
      expect(err[0].constraints.isEmail).toEqual(
        `emailAddress must be an email`
      );
    });

    it('has correct input', async () => {
      const input = {
        firstname: 'firstname',
        lastname: 'lastname',
        emailAddress: 'test@gmail.com',
        password: 'r1reqHDP595FDRoKh0GG',
      };

      const model = plainToInstance(UserDto, input);
      const err = await validate(model);
      expect(err.length).toBe(0);
    });
  });

  //password
  describe('password', () => {
    it('has not been given a value', async () => {
      const input = {
        firstname: 'firstname',
        lastname: 'lastname',
        emailAddress: 'test@gmail.com',
      };

      const model = plainToInstance(UserDto, input);

      const err = await validate(model);

      expect(err.length).not.toBe(0);
      expect(err[0].constraints.isDefined).toContain(
        `Wachtwoord is verplicht!`
      );
    });

    it('has an incorrect type', async () => {
      const input = {
        firstname: 'firstname',
        lastname: 'lastname',
        emailAddress: 'test@gmail.com',
        password: 0,
      };

      const model = plainToInstance(UserDto, input);

      const err = await validate(model);

      expect(err.length).not.toBe(0);
      expect(err[0].constraints.isString).toContain(
        `Wachtwoord moet van het type string zijn!`
      );
    });

    it('has an invalid value (password to weak)', async () => {
      const input = {
        firstname: 'firstname',
        lastname: 'lastname',
        emailAddress: 'test@gmail.com',
        password: 'password',
      };

      const model = plainToInstance(UserDto, input);

      const err = await validate(model);

      expect(err.length).not.toBe(0);
      expect(err[0].constraints.matches).toEqual(
        `Het wachtwoord is niet sterk genoeg! Het moet op zijn minst bestaan uit: 8 karakters, 1 hoofdletter, 1 kleine letter and 1 getal!`
      );
    });

    it('has correct input', async () => {
      const input = {
        firstname: 'firstname',
        lastname: 'lastname',
        emailAddress: 'test@gmail.com',
        password: 'r1reqHDP595FDRoKh0GG',
      };

      const model = plainToInstance(UserDto, input);
      const err = await validate(model);
      expect(err.length).toBe(0);
    });
  });
});
