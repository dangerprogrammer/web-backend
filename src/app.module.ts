import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthService, SearchService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    EntityModule,
    JwtModule.register({}),
    ConfigModule.forRoot({ isGlobal: !0 }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://danger:123@localhost:5432/nestjs?schema=public',
      autoLoadEntities: !0,
      synchronize: !0
    })
  ],
  controllers: [AppController],
  providers: [AuthService, SearchService],
})
export class AppModule {}
