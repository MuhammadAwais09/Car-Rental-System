import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { DriverType, Feature, OrderStatus, Roles } from '../../enums/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  @Input() car: any | null = {};
  @Input() btnDiv: boolean = false;
  @Input() priceUper: boolean = false;
  @Input() showCarFeatures: boolean = false;
  @Input() routing: string = '';
  @Input() isFavorite: boolean = false
  @Input() rentNowBtn: boolean = false;
  @Input() isShowroomOwner: boolean = false;
  @Input() isBooking: boolean = false;
  @Input() showroomId: string = '';
  @Input() isUserBooking = false;

  @Output() rentNow: EventEmitter<string> = new EventEmitter()
  @Output() favoriteEvent: EventEmitter<boolean> = new EventEmitter()
  @Output() updateStatusEmitter: EventEmitter<string> = new EventEmitter()


  driverType = DriverType;
  featureEnum = Feature;
  statusEnum = OrderStatus;
  showLoginPopup: boolean = false;
  booking: any = {}

  constructor(
    private http: HttpService,
    private toaster: ToastrService,
    private router: Router,
    private userService: UserService,
    public utilService: UtilsService,
    private activeRoute: ActivatedRoute
  ) { }

  isAdmin = false;
  filterButton: string = '';
  ngOnInit(): void {
    this.filterButton = localStorage.getItem('filterButton') || '';
    this.activeRoute.url.subscribe(urlSegments => {
      const currentUrl = urlSegments.join('/');
      if (currentUrl === 'favorites') {
        this.favoriteTab = true;
      }
    });
    this.isBooking ? this.booking = this.car : '';
    this.isBooking ? this.car = this.car.Car : this.car;
    this.isFavorite ? this.car = this.car.car : this.car;
    const role = localStorage.getItem('role');
    if (role === Roles.SUPERADMIN) {
      this.isAdmin = true
    }
  }

  rentNowFn(id: string): any {
    // if (!this.userService.isAuthenticated) {
    //   this.showLoginPopup = true
    //   return this.toaster.error('Please Login First');
    // }
    this.rentNow.emit(id);
    this.router.navigate(['/selected-car-details', 'car', id, 'rent'])
  }

  goToEditCar(event: any, id: string, isEditable: boolean) {
    event.stopPropagation();
    this.router.navigate([`add-upload-car-details/${id}/${isEditable}`])
  }

  addRemoveFavorite(event: any, id: string): any {
    event.stopPropagation();
    if (!this.userService.isAuthenticated) {
      this.showLoginPopup = true
      return this.toaster.error('Please Login First');
    }
    const carObj = {
      car: id
    }
    if (this.car.isFavorite || this.isFavorite)
      this.removeFavorite(carObj)
    else
      this.addFavorite(carObj)
  }

  addFavorite(carObj: { car: string }) {
    this.http.addToFavorite(carObj).subscribe((res: any) => {
      this.car.isFavorite = true
      this.toaster.success(res.message)
      this.favoriteEvent.emit(true)
    }, (err) => {
      //console.log(err);
      this.toaster.error(err.error.message)
    })
  }

  removeFavorite(carObj: { car: string }) {
    this.http.removeFavorite(carObj).subscribe((res: any) => {
      this.car.isFavorite = false
      this.toaster.success(res.message)
      this.favoriteEvent.emit(true)
    }, (err) => {
      this.toaster.error(err.error.message)
    })
  }

  favoriteTab: boolean = false;
  viewCard(event: any) {
    if (this.rentNowBtn) {
      this.rentNowFn(this.car._id)
      return
    }
    if (this.isBooking && this.booking.status == this.statusEnum.PENDING && this.showroomId != '') {
      this.goToViewOrrder();
    }
  }

  updateStatus(event: any, bookingId: string, status: string) {
    event.stopPropagation();
    const obj = {
      status: status,
      booking: bookingId
    }
    this.http.updateBookingOrder(obj).subscribe((res: any) => {
      this.toaster.success(res.message);
      this.updateStatusEmitter.emit(this.booking.status);
    })
  }

  goToViewOrrder(event?: any) {
    event.stopPropagation();
    localStorage.setItem('booking', JSON.stringify(this.booking))
    this.router.navigate([`selected-car-details/booking/${this.booking._id}/view`])
  }

}
