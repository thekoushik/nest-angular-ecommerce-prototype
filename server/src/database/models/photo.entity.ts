import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, AfterLoad} from "typeorm";
import {Product} from "./product.entity";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @ManyToOne(() => Product, product => product.images,{onDelete: 'CASCADE'})
    product: Product;

    protected image_url:string;

    @AfterLoad()
    getUrl() {
        this.image_url='product_images/'+this.filename;
    }
}