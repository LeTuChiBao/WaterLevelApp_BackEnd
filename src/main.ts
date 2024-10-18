import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  console.log('NODE_ENV:', process.env.NODE_ENV);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  //config folder upload
  app.useStaticAssets(join(__dirname, '../../uploads')); // thêm cho statuc file
  await app.listen(5000);
}
bootstrap();
