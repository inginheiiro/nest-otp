import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';


declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();
    await app.listen(3000);

    if (module.hot) {
        module.hot.accept();
        await module.hot.dispose(() => app.close());
    }
}

bootstrap().then();
