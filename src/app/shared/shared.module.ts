import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { SearchComponent } from './search/search.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SidebarComponent,
    PlayerComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatSliderModule,
    FormsModule
  ],
  exports: [
    SidebarComponent,
    PlayerComponent,
    SearchComponent
  ]
})
export class SharedModule { }
