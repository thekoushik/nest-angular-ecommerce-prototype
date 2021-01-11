import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthService } from '../../services/auth.service';

interface FSEntry {
  name: string;
  sku: string;
  price: number;
}

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  list=[];
  constructor(private auth:AuthService,private router:Router){

  }
  ngOnInit(){
    this.loadData()
  }
  async loadData(){
    try{
      let res:any=await this.auth.getReq('products');
      console.log(res)
      this.list=res.data;
      this.source.load(res.data.map(m=>({
        name: m.name, price: m.price, sku: m.sku,id:m.id
      })));
    }catch(e){
      console.log(e)
    }
  }

  settings = {
    mode: 'external',
    hideSubHeader: true,
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      
      name: {
        title: 'Name',
        type: 'string',
      },
      price: {
        title: 'Price',
        type: 'number',
      },
      sku: {
        title: 'SKU',
        type: 'string',
      },
    },
  };
  source: LocalDataSource = new LocalDataSource();

  onDelete(event): void {
    console.log(event);
    if (window.confirm('Are you sure you want to delete?')) {
      this.deleteProduct(event.data.id)
    }
  }
  async deleteProduct(id){
    try{
      let res:any=await this.auth.deleteReq('products/'+id);
      if(res.status){
        this.loadData();
      }else{

      }
    }catch(e){

    }
  }
  onEdit(event):void{
    console.log(event)
    this.router.navigateByUrl('/pages/products/edit/'+event.data.id);
  }
}