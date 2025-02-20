import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'content', 
    loadChildren: () => import('./content/content.module').then(m => m.ContentModule)
  },
  {
    path: '**', 
    redirectTo: 'content'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
