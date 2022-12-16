import { Test } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "Welkom bij de API van Roots!"', () => {
      expect(service.getData()).toEqual({ message: 'Welkom bij de API van Roots!' });
    });
  });
});
