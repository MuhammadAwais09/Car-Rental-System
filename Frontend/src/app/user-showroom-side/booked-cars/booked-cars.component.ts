import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-booked-cars',
  templateUrl: './booked-cars.component.html',
  styleUrls: ['./booked-cars.component.scss']
})

export class BookedCarsComponent implements OnInit {
  activeRouteDiv: boolean = false;
  isFavoritePage: boolean = false;
  pageTitle: string = 'Booked Cars'
  notFound: string = 'Data Not Found'
  carsData: any = []
  filterBtn: string = 'pending'
  query: string = 'pending';
  showroomId: string = '';
  isMyShowroom: boolean = false;
  isUserBooking = false;
  currentPage = 1;
  pageSize = 10;
  totalRecords: number = 0;
  bookingStatus = 'pending';
  constructor(
    private activeRoute: ActivatedRoute,
    private http: HttpService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getRouteData();
  }

  getRouteData() {
    this.activeRoute.data.subscribe((res: any) => {
      this.activeRouteDiv = res.routType;
      this.isFavoritePage = res.isFavorite;
      if (this.isFavoritePage) {
        this.pageTitle = 'Favorite Cars'
        this.getFavoriteCars()
      } else {
        this.getParams();
      }
      this.isUserBooking = res.isUserBooking;
    })
  }

  getParams() {
    this.activeRoute.params.subscribe((params: any) => {
      this.showroomId = params.showroomId ? params.showroomId : '';

      const showroomId = params['showroomId'];
      const queryParams: any = this.activeRoute.snapshot.queryParams;
      this.showroomId = showroomId;
      if (this.userService.showRoomId === showroomId) {
        this.isMyShowroom = true;
      }

      this.filterBtn = queryParams.status;
      this.getAllCars(queryParams.status);
    })
  }

  getCars() {
    if (this.isFavoritePage) {
      this.pageTitle = 'Favorite Cars'
      this.getFavoriteCars()
    } else {
      this.getParams();
    }
  }

  getFavoriteCars() {
    const query = `?page=${this.currentPage}&pageSize=${this.pageSize}`
    this.http.getAllFavorite(query).subscribe((res: any) => {
      this.carsData = res.data.data;
      this.totalRecords = res.data.totalCount;
    })
  }

  getAllCars(status?: string) {
    if (this.showroomId) {
      this.query = `?page=${this.currentPage}&pageSize=${this.pageSize}&status=${status ?? 'pending'}&showRoom=${this.showroomId}`;
    } else {
      this.query = `?page=${this.currentPage}&pageSize=${this.pageSize}&status=${status ?? ''}`;
    }
    this.http.getMyBookings(this.query).subscribe((res: any) => {
      this.carsData = res.data.data
      this.totalRecords = res.data.totalCount
    })
  }

  onStatusChange(tab: string) {
    this.filterBtn = tab;

    const queryParams = { ...this.activeRoute.snapshot.queryParams, status: tab };
    const navigationExtras: NavigationExtras = { queryParams: queryParams };
    this.router.navigate([], navigationExtras);

    this.getAllCars(tab);
  }

  statusChange(status: string) {
    this.bookingStatus = status;
    this.getAllCars(status);
  }

  pageChanged(event: number) {
    this.currentPage = event;
    if (this.isFavoritePage) {
      this.getFavoriteCars();
    }
  }

  pageSizeChanged(event: number) {
    this.currentPage = 1;
    this.pageSize = event;

    if (this.isFavoritePage) {
      this.getFavoriteCars();
    } else {
      this.getAllCars(this.bookingStatus);
    }
  }
}

