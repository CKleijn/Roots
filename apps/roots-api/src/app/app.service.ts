import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Get API welcome message
  getData(): { message: string } {
    return { message: 'Welkom bij de API van Roots!' };
  }
}
