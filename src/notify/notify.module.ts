import { Module } from '@nestjs/common';
import { NotifyController } from './notify.controller';
import { NotifyService } from './notify.service';
import { Reading } from 'src/readings/reading.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@src/users/user.entity';
import { Notify } from './notify.entity';


@Module({
  imports: [TypeOrmModule.forFeature([
    Notify,
    Reading,
    User
  ])],
  controllers: [NotifyController],
  providers: [NotifyService],
  exports: [NotifyService]
})
export class NotifyModule {}
