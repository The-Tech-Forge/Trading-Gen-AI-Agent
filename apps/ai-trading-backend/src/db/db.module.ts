import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...AppDataSource.options,
        autoLoadEntities: true, // picks up entities registered via TypeOrmModule.forFeature()
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DbModule {}
