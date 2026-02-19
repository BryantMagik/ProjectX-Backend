import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class CustomLoggerService implements LoggerService {
  constructor(private readonly pinoLogger: PinoLogger) {}

  // Contextos de NestJS que queremos silenciar en producción
  private readonly silentContexts = [
    'InstanceLoader',
    'RoutesResolver',
    'RouterExplorer',
    'NestFactory',
    'NestApplication',
  ];

  private shouldLog(context?: string): boolean {
    if (!context) return true;
    return !this.silentContexts.includes(context);
  }

  log(message: any, context?: string) {
    if (this.shouldLog(context)) {
      this.pinoLogger.info({ context }, message);
    }
  }

  error(message: any, trace?: string, context?: string) {
    this.pinoLogger.error({ context, trace }, message);
  }

  warn(message: any, context?: string) {
    this.pinoLogger.warn({ context }, message);
  }

  debug(message: any, context?: string) {
    if (this.shouldLog(context)) {
      this.pinoLogger.debug({ context }, message);
    }
  }

  verbose(message: any, context?: string) {
    if (this.shouldLog(context)) {
      this.pinoLogger.trace({ context }, message);
    }
  }
}
