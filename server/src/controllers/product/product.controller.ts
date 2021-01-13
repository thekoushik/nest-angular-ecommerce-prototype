import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseFilters, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
    async createProduct(@Body() dto: CreateProductDto,@UploadedFiles() files): Promise<DefaultResponse> {
        try{
            let result=await this.productService.create(dto,files.images.map(f=>f.filename))
            return {
                status:true,
                message: "Product created"
            };
        }catch(e){
            let message= "Cannot create product";
            if(e.code=='ER_DUP_ENTRY'){
                message='SKU already exist';
            }
            return {
                status:false,
                //data: e,
                message
            };
        }
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
    
    async updateProduct(@Param('id') id:string,@Body() dto: CreateProductDto,@UploadedFiles() files): Promise<DefaultResponse> {
        try{
            let result=await this.productService.update(id,dto,files && files.images && files.images.map(f=>f.filename))
            if(result.affected){
                return {
                    status: true,
                    message: 'Product updated'
                }
            }else{
                return {
                    status: false,
                    message: 'Product not found'
                }
            }
        }catch(e){
            let message= "Cannot update product";
            if(e.code=='ER_DUP_ENTRY'){
                message='SKU already exist';
            }
            return {
                status:false,
                //data: e,
                message
            };
        }
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id:string):Promise<DefaultResponse>{
        let existing=await this.productService.findOne(id);
        if(!existing){
            return {
                status: false,
                message: "Product not found"
            }
        }
        if(existing.images.length){
            existing.images.forEach(f=>{
                unlink(join(__dirname,'../../../','public','product_images',f.filename),(err)=>{console.log(err)});
            })
        }
        await this.productService.remove(id);
        return {
            status: true,
            message: 'Product Deleted'
        }
    }
}
