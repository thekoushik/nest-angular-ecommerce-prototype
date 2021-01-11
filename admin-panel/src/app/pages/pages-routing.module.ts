import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'products',
      component: ProductListComponent,
    },
    {
      path: 'products/add',
      component: ProductFormComponent,
    },
    {
      path: 'products/edit/:id',
      component: ProductFormComponent,
      //loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule),
    },
    {
      path: '',
      redirectTo: 'products',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
