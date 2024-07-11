import { SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle('Jiru API Documentation')
        .setDescription('The Jiru API Documentation for the Jiru App.')
        .setVersion('1.5')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("docs", app, document, {
        customSiteTitle: "Api Docs",
        customfavIcon: "https://avatars.githubusercontent.com/u/6936373?s=200&v=4",
        customJs: [
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-es-bundle.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.min.js",
        ],
        customCssUrl: [
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.css",
        ],
    });
}
