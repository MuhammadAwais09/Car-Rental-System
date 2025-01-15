import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SideIcon } from './side-icons/side-icons.component';
import { PaginationComponent } from './pagination/pagination.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    SideIcon,
    PaginationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule
  ],
  exports:[
    SideIcon,
    NgxPaginationModule,
    PaginationComponent
  ]
})
export class ParticleModule {

 }
