import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromocodesComponent } from './promocodes.component';

const routes: Routes = [
  {
    path: '',
    component: PromocodesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromocodesRoutingModule { }
