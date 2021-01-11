import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public api = environment.url;
  constructor(private http:HttpClient){
  }

  postReq(uri:string,data:any){
    return this.http.post(this.api+uri,data).toPromise();
  }
  getReq(uri){
      return this.http.get(this.api+uri).toPromise();
  }
  putReq(uri,data){
    return this.http.put(this.api+uri,data).toPromise();
  }
  deleteReq(uri){
    return this.http.delete(this.api+uri).toPromise();
  }
}