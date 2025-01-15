import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginSignupComponent } from './login-signup/login-signup.component'
import { RouterModule } from '@angular/router';
import { NgOtpInputModule } from 'ng-otp-input';
import { SharedModuleModule } from '../shared/shared-module.module';
@NgModule({
  declarations: [
    LoginSignupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    SharedModuleModule,
    RouterModule.forChild([

      {
        path: '',
        redirectTo: 'login/user',
        pathMatch: 'full'
      },
      {
        path: 'login/:id',
        component: LoginSignupComponent,
        data: { togle: 'login', title: 'Sign In' }
      },
      {
        path: 'signup/:id',
        component: LoginSignupComponent,
        data: { togle: 'signup', title: 'Sign Up' }
      },
      {
        path: 'otp/:id',
        component: LoginSignupComponent,
        data: { togle: 'otp' }
      }
      ,
      {
        path: 'email-for reset-password',
        component: LoginSignupComponent,
        data: { togle: 'reset-email', title: "Enter email for reset password" }
      }
      ,
      {
        path: 'change-new-password',
        component: LoginSignupComponent,
        data: { togle: 'set-new-password', title: 'Change Password' }
      }
      ,
      {
        path: 'select-account-type',
        component: LoginSignupComponent,
        data: { togle: 'select-user' }
      }
    ]),
  ]
})
export class UserAtuhenticationModule { }
