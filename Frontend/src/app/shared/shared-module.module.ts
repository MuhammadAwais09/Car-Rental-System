import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { DashboardComponent } from '../user-showroom-side/dashboard/dashboard.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HeaderComponent } from './pages/header/header.component';
import { DashboardSideNavComponent } from './pages/dashboard-side-nav/dashboard-side-nav.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardsComponent } from './pages/cards/cards.component';
import { CarImagesFrameComponent } from './pages/car-images-frame/car-images-frame.component';
import { ParticleModule } from './particles/particles.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ShowroomCardComponent } from '../pages/showroom-card/showroom-card.component';
import { LoginPopupComponent } from './particles/login-popup/login-popup.component';
import { CnicDirective } from './directive/cnic.directive';
import { NumberonlyDirective } from './directive/numberonly.directive';
import {NgxPaginationModule} from 'ngx-pagination';
import { NonNegativeDirective } from './directive/non-negative.directive';


@NgModule({
  declarations: [
    DashboardSideNavComponent,
    FooterComponent,
    HeaderComponent,
    CardsComponent,
    CarImagesFrameComponent,
    ShowroomCardComponent,
    LoginPopupComponent,
    CnicDirective,
    NumberonlyDirective,
    NonNegativeDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ParticleModule,
    NgxPaginationModule
  ],
  exports: [
    DashboardSideNavComponent,
    FooterComponent,
    HeaderComponent,
    CardsComponent,
    ShowroomCardComponent,
    FormsModule,
    RouterModule,
    ParticleModule,
    NgxSliderModule,
    CnicDirective,
    NumberonlyDirective,
    NgxPaginationModule,
    NonNegativeDirective
  ]
})
export class SharedModuleModule {

}
