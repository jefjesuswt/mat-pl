import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumComponent } from './album/album.component';
import { ContentRoutingModule } from './content-routing.module';
import { HomeComponent } from './home/home.component';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [
    AlbumComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    ContentRoutingModule,
    MatTableModule,
    MatCardModule
  ], 
  exports: [
    AlbumComponent,
    HomeComponent
  ]
})
export class ContentModule { }
