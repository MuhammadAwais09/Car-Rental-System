import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ICONS } from '../../enums/icons';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { OrderStatus, Roles } from '../../enums/enums';
import { RoutesNames } from '../../common/titles';

@Component({
  selector: 'app-dashboard-side-nav',
  templateUrl: './dashboard-side-nav.component.html',
  styleUrls: ['./dashboard-side-nav.component.scss'],
})
export class DashboardSideNavComponent implements OnInit {
  isAdmin: Boolean = false;
  RouteNames = RoutesNames;

  ngOnInit(): void {
    // if (this.router.url.includes('/admin')) this.isAdmin = true;
    const role=localStorage.getItem('role');
    if(role===Roles.SUPERADMIN){
      this.isAdmin=true
    }
  }

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  showroomId: string = '';
  constructor(
    public userService: UserService,
    private router: Router,
    private http: HttpService
  ) {
    this.showroomId = userService.showRoomId;
  }
  activeSdieNavBtn = 'home';
  iconType = ICONS;
  selectActBtn(tab: string) {
    this.activeSdieNavBtn = tab;
  }

  goToCarRent(showroomId?: string) {
    if (showroomId) {
      this.router.navigate(['availble-car-for-rent'], {
        queryParams: { showroomId: showroomId },
      });
    } else {
      this.router.navigate(['availble-car-for-rent']);
    }
    this.changeRoute();
  }

  goToMyOrders() {
    const queryParams = {
      status: OrderStatus.PENDING,
    };
    this.router.navigate(['/my-orders', this.showroomId], {
      queryParams: queryParams,
    });
    this.changeRoute();
  }

  goToBookedCars() {
    const queryParams = {
      status: OrderStatus.PENDING,
    };
    this.router.navigate(['/booked-car-list'], { queryParams: queryParams });
    this.changeRoute();
  }

  isMyOrderActive(): boolean {
    const route: string = this.router.url;
    return route.includes('my-orders') && route.includes('status');
  }

  isBookedCarActive(): boolean {
    const route: string = this.router.url;
    return route.includes('booked-car-list') && route.includes('status');
  }

  isContentPageActive (): boolean {
    const route: string = this.router.url;    
    return route.includes('content-management');
  }

  changeRoute() {
    this.closeModal.emit(true);
  }
}
