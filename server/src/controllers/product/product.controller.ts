import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseFilters, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MongoExceptionFilter } from 'src/database/filter';
import { CreateProductDto } from 'src/database/product.dto';
import { ProductService } from 'src/database/services/product_service';
import { DefaultResponse } from 'src/DefaultResponse';
import { diskStorage } from 'multer';
import {extname,join} from 'path';
import {unlink} from 'fs';

@Controller('products')
export class ProductController {

    constructor(private productService:ProductService){}

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'images', maxCount: 5 },
        ],{
            storage: diskStorage({
                destination: './public/product_images',
                filename: (req,file,cb)=>{
                    cb(null, Date.now()+extname(file.originalname));
                }
            })
        })
    )
    @UseFilters(MongoExceptionFilter)
    async createProduct(@Body() dto: CreateProductDto,@UploadedFiles() files): Promise<DefaultResponse> {
        //console.log(files);
        let result=await this.productService.create(dto,files.images.map(f=>f.filename))
        return {
            status:true,
            data: result,
            message: "Product created"
        };
    }

    @Get()
    async getProducts():Promise<DefaultResponse>{
        let result=await this.productService.findAll();
        return {
            status:true,
            data: result,
            message: "Data fetched"
        };
    }
    @Get(':id')
    async getProduct(@Param('id') id:string):Promise<DefaultResponse>{
        let result=await this.productService.findOne(id);
        if(!result){
            return {
                status: false,
                message: 'Product not found'
            }
        }
        return {
            status:true,
            data: result,
            message: "Data fetched"
        };
    }

    @Put(':id')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'images', maxCount: 5 },
        ],{
            storage: diskStorage({
                destination: './public/product_images',
                filename: (req,file,cb)=>{
                    cb(null, Date.now()+extname(file.originalname));
                }
            })
        })
    )
    @UseFilters(MongoExceptionFilter)
    async updateProduct(@Param('id') id:string,@Body() dto: CreateProductDto,@UploadedFiles() files): Promise<DefaultResponse> {
        let result=await this.productService.update(id,dto,files && files.images && files.images.map(f=>f.filename))
        return {
            status: true,
            data: result,
            message: 'Product updated'
        }
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id:string):Promise<DefaultResponse>{
        let result=await this.productService.remove(id);
        if(result){
            if(result.images.length){
                result.images.forEach(f=>{
                    unlink(join(__dirname,'../../../','public','product_images',f),(err)=>{console.log(err)});
                })
            }
            return {
                status: true,
                message: 'Product Deleted'
            }
        }else{
            return {
                status: false,
                message: 'Product not found'
            }
        }
    }
}
