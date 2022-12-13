import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../environments/environment';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CompanyModule } from './company/company.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(environment.API_URL),
    UserModule,
    CompanyModule,
    EventModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
