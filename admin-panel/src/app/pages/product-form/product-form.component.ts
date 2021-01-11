import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'product-form',
  styleUrls: ['./product-form.component.scss'],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  files=[];
  id='';
  formGroup:FormGroup;
  imageSrc=[];
  oldSrc=[];

  constructor(private authService:AuthService,private route:ActivatedRoute,private fb:FormBuilder,private router:Router,private toastr:NbToastrService){
  }
  ngOnInit(): void {
    this.formGroup=this.fb.group({
      name: ['',Validators.required],
      sku: ['',Validators.required],
      price: [0,Validators.required]
    })

    this.id=this.route.snapshot.paramMap.get('id')||'';
    if(this.id){
      this.load()
    }
  }
  async load(){
    try {
      let res:any=await this.authService.getReq('products/'+this.id);
      console.log(res.data)
      if(res.status){
        this.formGroup.patchValue(res.data);
        this.oldSrc=res.data.image_urls.map(m=>this.authService.api+m);
      }else{
        this.toastr.show('Error occured','Error');
      }
    }catch(e){

    }
  }
  async add(){
    let data=this.formGroup.value;
    let fd=new FormData();
    for(let key in data)
      fd.append(key,data[key]);
    for(let file of this.files)
      fd.append('images',file);
    try{
      let res:any;
      if(this.id){
        res=await this.authService.putReq('products/'+this.id,fd);
      }else{
        if(!this.files.length){
          this.toastr.danger('Please select image');
          return;
        }
        res=await this.authService.postReq('products',fd);
      }
      if(res.status){
        this.router.navigateByUrl('/pages/products');
      }else{
        this.toastr.danger(res.message,'Error');
      }
    }catch(e){
      this.toastr.show('Error occured','Error');
    }
  }

  onFileChoose(event){
    if(!event.target.files.length) return;
    var files = event.target.files;
    //var kb = Math.round((file.size / 1024));
    //if(kb>(3*1024)){
    //  return;
    //}

    this.files = files;
    this.imageSrc=[];
    for(let file of files){
      this.readFile(file);
    }
  }
  readFile(file){
    const reader = new FileReader();
    reader.onload = e =>{
      //console.log(e.target.result)
      this.imageSrc.push(e.target.result.toString());//reader.result.toString()
    };
    reader.readAsDataURL(file);
  }
}
