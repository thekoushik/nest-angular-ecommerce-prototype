import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './controllers/product/product.controller';
import { ProductService } from './database/services/product_service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './database/models/product.entity';
import { Photo } from './database/models/photo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService:ConfigService) =>{
        return {
          name: 'default',
          type: 'mysql', 
          host: 'localhost',
          port: 3306,
          username: configService.get<string>('db_user'),
          password: configService.get<string>('db_pass'),
          database: configService.get<string>('db_name'),
          entities: [ Product,Photo ],
          synchronize: true
        }
      },
    }),
    TypeOrmModule.forFeature([ Product,Photo ])//this can be placed in a seperate module
  ],
  controllers: [AppController, ProductController],
  providers: [AppService,ProductService],
})
export class AppModule {
  constructor(){
  }
}
