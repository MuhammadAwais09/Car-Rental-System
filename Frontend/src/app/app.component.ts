import { Component, OnInit } from '@angular/core';
import { HttpService } from './shared/services/http.service';
import { UserService } from './shared/services/user.service';
import { UtilsService } from './shared/services/utils.service';
import { NavigationEnd, Router } from '@angular/router';
// import {getMessaging, getToken} from "@angular/fire/messaging";
import { getMessaging, getToken } from '@firebase/messaging';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Roles } from './shared/enums/enums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'car-rent';
  token: string = '';
  constructor(
    private http: HttpService,
    private userService: UserService,
    private utilService: UtilsService,
    private router: Router,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    const role = localStorage.getItem('role')
    if (this.userService.isAuthenticated && role === Roles.SHOWROOMOWNER) {
      this.http.getUserShowroom().subscribe((res: any) => {
        this.userService.showRoomId = res.data?._id;
      });
    }

    if (this.userService.isAuthenticated && localStorage.getItem('token')) {
      const query = `?isRead=false`;
      this.http.getNotiifications(query).subscribe((res: any) => {
        const notifications = res.data.data;
        localStorage.setItem('notifications', notifications.length + '');
      })
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Scroll to the top of the page when route changes
        window.scrollTo(0, 0);
      }
    });

    if (localStorage.getItem('token')) {
      // this.utilService.profilePic = localStorage.getItem('dp') as string
      this.http.viewProfile().subscribe((res: any) => {
        //console.log(res);

        localStorage.setItem('user', JSON.stringify(res.data));
        if (res.data.profilePic)
          localStorage.setItem(
            'dp',
            this.utilService.getProfileUrl(res.data.profilePic)
          );
      });
    }
  }
}
