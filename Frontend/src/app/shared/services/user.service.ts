import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import { Roles } from '../enums/enums';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private router: Router
  ) { }

  get isAuthenticated() {
    return this.userToken != null;
  }

  get isAdmin() {
    return localStorage.getItem('role') === Roles.SUPERADMIN;
  }

  get notifications () {
    return parseInt(localStorage.getItem('notifications') as string);
  }

  get showroomOwner(){
    return JSON.parse(localStorage.getItem('showroomUser') as string)
  }

  set userToken(token: string) {
    localStorage.setItem('token', token)
  }

  get userToken() {
    return localStorage.getItem('token') as string
  }

  set resetToken(token: string) {
    sessionStorage.setItem('token', token)
  }
  set shooRoomToken(token: string) {
    localStorage.setItem('showRoomUserToken', token)
  }
  set showRoomId(token: string) {
    localStorage.setItem('showRoomId', token)
  }
  get showRoomId() {
    return localStorage.getItem('showRoomId') as string
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/'])
  }


}
