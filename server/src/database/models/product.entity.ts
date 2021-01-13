import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Photo } from './photo.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique:true})
  sku: string;

  @Column()
  price: number;

  @OneToMany(() => Photo, photo => photo.product)
  images: Photo[];

}
