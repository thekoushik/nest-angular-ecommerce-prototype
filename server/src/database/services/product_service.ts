import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, InsertResult, Repository } from "typeorm";
import { Product } from "../models/product.entity";
import { Photo } from '../models/photo.entity';
import { CreateProductDto } from "../product.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>
  ) {}

  async create(dto:CreateProductDto,images=[]): Promise<InsertResult> {
    let newProduct = await this.productRepository.insert({...dto});
    if(images.length){
      this.photoRepository.insert(images.map(filename=>({product: newProduct.identifiers[0].id, filename})))
    }
    return newProduct;
  }
  findOne(id):Promise<Product>{
    return this.productRepository.findOne(id,{relations:['images']});
  }
  findAll(): Promise<Product[]> {
    return this.productRepository.find({relations:['images']});
  }
  update(id,data,images=[]){
    if(images.length){
      this.photoRepository.insert(images.map(filename=>({product: id, filename})))
    }
    return this.productRepository.update({id},{...data});
  }
  remove(id):Promise<DeleteResult>{
    return this.productRepository.delete({id:id});
  }
}
