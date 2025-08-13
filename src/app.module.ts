import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { TestController } from './test/test.controller';

@Module({
  imports: [RoomModule],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}
