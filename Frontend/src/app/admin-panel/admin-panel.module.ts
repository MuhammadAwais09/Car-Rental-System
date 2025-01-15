import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModuleModule } from '../shared/shared-module.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from '../user-showroom-side/home/home.component';
import { DashboardComponent } from '../user-showroom-side/dashboard/dashboard.component';
import { ContentManagementComponent } from './content-management/content-management.component';
import { EnterShowroomDetailsComponent } from '../admin-showroom-side/enter-showroom-details/enter-showroom-details.component';
// import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  declarations: [
    ContentManagementComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    // ReactiveFormsModule,
    SharedModuleModule,
    // NgxEditorModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
        children: [
          {
            path: '',
            redirectTo: 'showrooms',
            pathMatch: 'full',
          },
          {
            path: 'showrooms',
            component: DashboardComponent,
          },
          {
            path: 'cars',
            component: DashboardComponent,
          },
          {
            path: 'content-management/:id',
            component: ContentManagementComponent,
          },
          {
            path: 'showroom/:id',
            component: EnterShowroomDetailsComponent,
          },
        ],
      },
    ]),
    
  ],
  exports: [
    // NgxEditorModule
  ]
})
export class AdminPanelModule { }
