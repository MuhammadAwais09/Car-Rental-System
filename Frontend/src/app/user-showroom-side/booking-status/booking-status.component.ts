import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from "@angular/common";

@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss']
})
export class BookingStatusComponent {
  pageType=''
constructor(
  private activeRoute:ActivatedRoute,
  private location: Location,
  private router: Router
){
  this.activeRoute.data.subscribe((res:any)=>{
this.pageType=res.pageType
  })
}

goBack () {
    this.location.back();
}

  goToMyCars () {
    this.router.navigate(['/availble-car-for-rent'], {replaceUrl: true, queryParams: {showroomId: localStorage.getItem('showRoomId')}});
  }

  goToMyBookings () {
    this.router.navigate(['/booked-car-list'], {replaceUrl: true})
  }
}
