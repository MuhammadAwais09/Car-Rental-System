import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AuthInterceptors } from './shared/interceptors/auth.interceptors';
import {environment} from '../environments/environment';
// import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireMessagingModule} from "@angular/fire/compat/messaging";
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import {initializeApp} from 'firebase/app';
import {NgxPaginationModule} from 'ngx-pagination';


initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireMessagingModule,
    // NgxSliderModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptors,
      multi: true,
    },
    ScreenTrackingService,UserTrackingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
