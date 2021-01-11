import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './controllers/product/product.controller';
import { ProductSchema } from './database/models/product';
import { ProductService } from './database/services/product_service';
import {join} from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    // ServeStaticModule.forRoot({
    //  rootPath: join(__dirname, '..', 'public'),
    //   serveRoot: '/public/*',
    // }),
    MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get<string>('MONGODB_URI'),
          useCreateIndex:true,
          useNewUrlParser:true,
          useUnifiedTopology:true,
          useFindAndModify:true,
          autoIndex: true
        }),
        inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {name:'Product',schema: ProductSchema}
    ]),
  ],
  controllers: [AppController, ProductController],
  providers: [AppService,ProductService],
})
export class AppModule {}
