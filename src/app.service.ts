import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! This is the Jiru API Documentation for the Jiru App.';
  }
}
