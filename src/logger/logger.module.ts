import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { createStream } from 'rotating-file-stream';
import { join } from 'path';
import { IncomingMessage } from 'http';
import { CustomLoggerService } from './custom-logger.service';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: isProduction ? 'info' : 'info',
        genReqId: (req: IncomingMessage) =>
          (req.headers['x-request-id'] as string) || randomUUID(),
        transport: isProduction
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:HH:MM:ss',
                ignore: 'pid,hostname,context',
                messageFormat: '{context} {msg}',
              },
            },
        stream: isProduction
          ? createStream('app.log', {
              interval: '1d',
              path: join(process.cwd(), 'logs'),
              maxFiles: 7,
            })
          : undefined,
        autoLogging: false,
      },
      forRoutes: [],
    }),
  ],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
