import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ 
      connectionString,
      ssl: connectionString?.includes('sslmode') 
        ? undefined 
        : { rejectUnauthorized: true }
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
  }
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Conexión a la base de datos establecida con éxito.');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
    console.log('Conexión a la base de datos cerrada.');
  }
}
