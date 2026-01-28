
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Prefer DIRECT_URL for long-running servers (Render) to avoid Transaction Pooler issues
    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('Database connection string (DIRECT_URL/DATABASE_URL) is not defined');
    }
    
    // console.log(`Connecting to DB: ${connectionString.split('@')[1]}`); // Log host for debug
    
    const pool = new Pool({ 
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
    const adapter = new PrismaPg(pool);
    super({ 
      adapter,
      log: [
        // { emit: 'event', level: 'query' },
        // { emit: 'event', level: 'error' },
        // { emit: 'event', level: 'info' },
        // { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
