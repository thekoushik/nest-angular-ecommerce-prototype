import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "../models/product";
import { CreateProductDto } from "../product.dto";

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  create(dto:CreateProductDto,images=[]): Promise<Product> {
    const created = new this.productModel({
        ...dto,
    });
    if(images.length){
        created.images=images;
    }
    return created.save();
  }
  findOne(id):Promise<Product>{
    return this.productModel.findById(id).exec();
  }
  findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }
  update(id,data,images=[]){
    let body={...data};
    if(images.length){
      body['$push']={images};
    }
    return this.productModel.updateOne({_id:id},body);
  }
  remove(id):Promise<Product>{
    return this.productModel.findOneAndDelete({_id:id}).exec();
  }
}
