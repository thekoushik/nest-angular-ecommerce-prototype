import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class UniqueValidationError{
  constructor(e){
    this.error=e;
  }
  error:any;
}

export type ProductDocument = Product & Document;

@Schema({
    toJSON:{
        virtuals: true, 
    }
})
export class Product {
  @Prop()
  name: string;

  @Prop({unique:true})
  sku: string;

  @Prop()
  price: number;

  @Prop()
  images: string[];
}
let _ProductSchema = SchemaFactory.createForClass(Product)

_ProductSchema.plugin((schema, options)=>{
  var indexes=schema.indexes();
  if(indexes.length==0) return;
  let postHook=(error, _, next)=>{
      if(error.name=='MongoError' && error.code==11000){
          let regex=/index: (.+) dup key:/;
          let matches:any=regex.exec(error.message);
          if(matches){
              matches=matches[1];
              for(var i=0;i<indexes.length;i++){
                  for(var field in indexes[i][0]){
                      if(indexes[i][1].unique && (matches.indexOf('$'+field)>=0 || matches.indexOf(field)>=0)){
                          return next(new UniqueValidationError({
                              path:field,
                              kind:'unique',
                              message:  field+' already exist'
                          }));
                      }
                  }
              }
          }
      }
      next(error);
  }
  schema.post('save', postHook);
  schema.post('update', postHook);
  schema.post('findOneAndUpdate', postHook);
})

_ProductSchema.virtual('image_urls').get(function(){
    return this.images.map(m=>{
        return 'product_images/'+m;
    })
})

export const ProductSchema=_ProductSchema;