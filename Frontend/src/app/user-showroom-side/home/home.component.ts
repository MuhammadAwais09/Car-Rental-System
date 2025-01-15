import { Component, NgZone, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { UserService } from 'src/app/shared/services/user.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { interval } from 'rxjs';
import { Roles } from 'src/app/shared/enums/enums';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  value: number = 40;
  highValue: number = 60;
  options: Options = {
    floor: 0,
    ceil: 100,
  };

  constructor(
    private userService: UserService,
    private http: HttpService,
    private _utilService: UtilsService,
    private ngZone: NgZone
  ) {
    if (userService.isAuthenticated) {
      this.startFunction();
    }
  }
  currentPage = 1;
  pageSize = this._utilService.pagination.pageSize;
  unreadNotifications: any[] = [];
  unreadTotalCount!: number;

  // Function that checks notifications after 20 seconds
  startFunction() {
    setTimeout(() => {
      this.getUnreadNotifications();
    }, 20000);
  }


  ngOnInit() {
    if (this.userService.isAuthenticated) {
      this.notification();
      this.getUnreadNotifications();
    }
  }

  notification() {
    const isNotificationAllowed = localStorage.getItem('isNotificationAllowed');
    if (!isNotificationAllowed && this.userService.isAuthenticated) {
      const deviceToken = localStorage.getItem('deviceToken');
      if (deviceToken) {
        this.http.allowNotifications(deviceToken).subscribe(
          (res) => {
            //console.log('Notification added successfully');
            localStorage.setItem('isNotificationAllowed', 'true');
          },
          (error) => {
            console.error('Error while allowing notifications:', error);
          }
        );
      } else {
        this._utilService.requestPermission();
      }
    }
  }

  getUnreadNotifications() {
    const query = `?page=${this.currentPage}&pageSize=${this.pageSize}&isRead=false`;
    this.http.getNotiifications(query).subscribe((res: any) => {
      this.unreadNotifications = res.data.data;
      localStorage.setItem('notifications', this.unreadNotifications.length + '');
      this.unreadTotalCount = res.data.totalCount;
    })
  }


}
