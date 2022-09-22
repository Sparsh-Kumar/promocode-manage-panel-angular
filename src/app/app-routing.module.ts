import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'promocodes', pathMatch: 'full' },
  { path: 'promocodes', loadChildren: () => import('./promocodes/promocodes.module').then((m) => m.PromocodesModule) },
  { path: '**', redirectTo: 'promocodes', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
