import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { UserService } from '../../shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Roles } from 'src/app/shared/enums/enums';
import { compileNgModule } from '@angular/compiler';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  showRoomCarData: any[] = [];
  selectedModalBtn = 'all';
  compoenentName = 'dashboard';
  dashBoardCardData: any[] = [];
  carTypeTitle = 'Recent Cars';
  searchFIeld = '';
  carsData: any[] = []

  // Pagination
  currentPage = 1;
  pageSize = this.util.pagination.pageSize;
  totalRecords: number = 0;

  currentUrl: string = '';

  constructor(
    private httpSerivice: HttpService,
    private userService: UserService,
    private router: Router,
    private util: UtilsService,
    private route: ActivatedRoute
  ) {
    this.currentUrl = this.router.url;
  }

  filterBtn = 'pending'  // Default Filter;
  adminRoute: string = ''
  isAdmin = false;
  testUser: any
  ngOnInit(): void {
    const role = localStorage.getItem('role');

    this.getShowrooms();
    // Dummy User Data so that user can view car without login
    this.testUser = {
      "email": "email",
      "firstName": "firstName",
      "lastName": "lastName",
      "phoneNumber": "phoneNumber",
      "profilePic": "file",
      "address": { "_id": "id" },
      "id": "id",
      "role": "role",
      "deviceToken": "deviceToken"
    };
    const userString = JSON.stringify(this.testUser);
    if (!this.userService.isAuthenticated) {
      localStorage.setItem('user', userString);
    }

    if (role === Roles.SUPERADMIN) {
      this.isAdmin = true;
      if (this.currentUrl.startsWith('/') && this.currentUrl.split('/')[1].length === 0) {
        this.router.navigate(['/admin/showrooms']);
      }
      this.adminRoute = this.currentUrl.replace('/admin/', '');

      if (this.adminRoute === 'showrooms') {
      } else if (this.adminRoute === 'cars') {
        this.getCarsWithFilter();

      }
    }
    else {
      if (this.userService.isAuthenticated) {
        localStorage.setItem('filter', this.filterBtn)
        this.getRecommendedCars();
        // this.getCars();
        this.carTypeTitle = 'Recommended Cars';
      } else {
        this.getCars();
      }
    }

  }

  recommendedLength = 0;
  getRecommendedCars() {
    this.httpSerivice.getRecommendedCars(`?pageSize=3`).subscribe(
      (res: any) => {
        this.dashBoardCardData = res.data.cars;
        this.recommendedLength = res.data.totalCount
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  getShowrooms() {
    // for now ; using status as pending ; else get from admin
    let query = `?page=${this.currentPage}&pageSize=${this.pageSize}&status=${this.filterBtn}`;

    this.httpSerivice.getShowRooms(query).subscribe((res: any) => {
      if (res) {
        this.showRoomCarData = res.data.data;
        this.totalRecords = res.data.totalCount;
      }
    });
  }

  getCars() {
    this.httpSerivice.getCarByParams(`?pageSize=3`).subscribe((res: any) => {
      this.dashBoardCardData = res.data.data;
    });
  }

  getCarsWithFilter() {
    const query = `?pageSize=${this.pageSize}&page=${this.currentPage}&status=${this.filterBtn}`;
    this.httpSerivice.getCarByParams(query).subscribe((res: any) => {
      this.carsData = res.data.data;
      this.totalRecords = res.data.totalCount; // Update totalRecords for pagination
    });
  }

  modalSelectedBtn(tab: string) {
    this.selectedModalBtn = tab;
  }

  pageChanged(event: number) {
    this.currentPage = event;
    this.getShowrooms();
  }

  pageSizeChanged(event: number) {
    this.currentPage = 1;
    this.pageSize = event;
    this.getShowrooms();
  }

  viewAllRecommendations() {
    this.router.navigate(['availble-car-for-rent'], {
      queryParams: { action: 'recommended' },
    });
  }

  search() {
    this.router.navigate(['/availble-car-for-rent'], {
      queryParams: { search: this.searchFIeld },
    });
  }

  updateFilterButton(value: any) {
    this.filterBtn = value;
    localStorage.setItem('filter', this.filterBtn)
    this.getShowrooms()
  }

  updateCarFilterButton(value: any) {
    this.filterBtn = value;
    localStorage.setItem('filter', this.filterBtn)
    this.getCarsWithFilter();
  }

  carsPageChanged(event: number) {
    this.currentPage = event;
    this.getCarsWithFilter();
  }


  carsPageSizeChanged(event: any) {
    this.currentPage = 1;
    this.pageSize = event;
    this.getCarsWithFilter();
  }
}

