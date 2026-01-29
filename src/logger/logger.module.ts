import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { createStream } from 'rotating-file-stream';
import { join } from 'path';
import { IncomingMessage } from 'http';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: isProduction ? 'info' : 'debug',
        genReqId: (req: IncomingMessage) =>
          (req.headers['x-request-id'] as string) || randomUUID(),
        transport: isProduction
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:HH:MM:ss',
                ignore: 'pid,hostname',
              },
            },
        stream: isProduction
          ? createStream('app.log', {
              interval: '1d',
              path: join(process.cwd(), 'logs'),
              maxFiles: 7,
            })
          : undefined,
      },
    }),
  ],
})
export class LoggerModule {}
