import { Component, OnInit } from '@angular/core';
import { HttpService } from "../../shared/services/http.service";
import { ToastrService } from "ngx-toastr";
import { from } from "rxjs";
import { UtilsService } from "../../shared/services/utils.service";
import { Router } from "@angular/router";
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  readNotifications: any[] = [];
  unreadNotifications: any[] = [];
  readCurrentPage = 1;
  unreadCurrentPage = 1;
  readPageSize = this.utils.pagination.pageSize;
  unreadPageSize = this.utils.pagination.pageSize;
  unreadTotalCount!: number;
  readTotalCount!: number;

  constructor(
    private http: HttpService,
    private toaster: ToastrService,
    public utils: UtilsService,
    private router: Router,
    public userService: UserService
  ) {
  }

  ngOnInit() {
    this.getUnreadNotifications();
    this.getReadNotifications();
  }

  visitBooking(bookingId: string, notificationId?: string) {
    if (notificationId) {
      this.http.readSingleNotification(notificationId as string).subscribe((res: any) => {
        //console.log("Read Successfully");
      })
    }
    this.router.navigate([`/selected-car-details/booking/${bookingId}/view`]);
  }

  visitCar(carId: string, notificationId?: string) {
    if (notificationId) {
      this.http.readSingleNotification(notificationId as string).subscribe((res: any) => {
        //console.log("Read Successfully");
      })
    }
    this.router.navigate([`/add-upload-car-details/${carId}/false`]);

  }

  visiShowroom(showroomId: string, notificationId?: string) {
    console.log(showroomId);

    if (notificationId) {
      this.http.readSingleNotification(notificationId as string).subscribe((res: any) => {
        //console.log("Read Successfully");
      })
    }
    this.router.navigate([`/admin/showroom/${showroomId}`]);
  }


  getUnreadNotifications() {
    const query = `?page=${this.unreadCurrentPage}&pageSize=${this.unreadPageSize}&isRead=false`;
    this.http.getNotiifications(query).subscribe((res: any) => {
      this.unreadNotifications = res.data.data;
      localStorage.setItem('notifications', this.unreadNotifications.length + '');
      this.unreadTotalCount = res.data.totalCount;
    })
  }

  getReadNotifications() {
    const query = `?page=${this.readCurrentPage}&pageSize=${this.readPageSize}&isRead=true`;
    this.http.getNotiifications(query).subscribe((res: any) => {
      this.readNotifications = res.data.data;
      this.readTotalCount = res.data.totalCount;
    })
  }

  readSingleNotification(id: string) {
    this.http.readSingleNotification(id).subscribe((res: any) => {
      this.toaster.success(res.message);
      // this.getNotiifications();
    })
  }

  readAllNotifications() {
    this.http.readAllNotifications().subscribe((res: any) => {
      this.toaster.success(res.message);
      this.unreadNotifications = [];
      localStorage.setItem('notifications', '0')
      // this.getNotiifications();
    })
  }

  pageChangedForRead(event: number) {
    this.readCurrentPage = event;
    this.getReadNotifications();
  }

  pageChangedForUnread(event: number) {
    this.unreadCurrentPage = event;
    this.getUnreadNotifications();
  }

  pageSizeChangedForUnread(event: number) {
    this.unreadCurrentPage = 1;
    this.unreadPageSize = event;
    this.getUnreadNotifications();
  }

  pageSizeChangedForRead(event: number) {
    this.readCurrentPage = 1;
    this.readPageSize = event;
    this.getReadNotifications();
  }
}
