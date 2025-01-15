import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { Roles } from 'src/app/shared/enums/enums';
import { HttpService } from 'src/app/shared/services/http.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
@Component({
  selector: 'app-availble-car-for-rent',
  templateUrl: './availble-car-for-rent.component.html',
  styleUrls: ['./availble-car-for-rent.component.scss'],
})
export class AvailbleCarForRentComponent implements OnInit {
  dashBoardCardData: any = [];
  pageTitle = 'Avaliable Cars';
  getAllFvrt: any = [];
  showRomCardData: any = [];
  showroomId: string = '';
  isMyShowroom: boolean = false;
  brands: any = [];
  selectedBrand = '';
  priceRange = 0;
  currentPage = 1;
  pageSize = this.utilService.pagination.pageSize;
  totalRecords: number = 0;
  action = '';
  searchText = '';

  constructor(
    private activeRoute: ActivatedRoute,
    private httpService: HttpService,
    private userService: UserService,
    public utilService: UtilsService
  ) { }

  showroomOwner: boolean = false
  userShowroom: boolean = false
  ngOnInit(): void {
    this.getParams();
    this.getBrands();
    localStorage.setItem('filterButton', this.filterButton);
    const userShowroom = localStorage.getItem('showRoomId');
    if (userShowroom === this.showroomId) {
      this.userShowroom = true
    }
    const role = localStorage.getItem('role');
    if (role === Roles.SHOWROOMOWNER) {
      this.showroomOwner = true;
    }
  }

  getBrands() {
    this.httpService.getAlBrand().subscribe((res: any) => {
      this.brands = res.data;
    });
  }

  reset() {
    this.priceRange = 0;
    this.selectedBrand = '';
    this.getAllCars();
  }

  getAllCars() {
    let query: string = '';
    query = this.showroomId
      ? `?showroomId=${this.showroomId}&page=${this.currentPage}&pageSize=${this.pageSize}&status=${this.filterButton}`
      : '?page=${this.currentPage}&pageSize=${this.pageSize}';
    if (this.selectedBrand !== '') {
      query += `&brand=${this.selectedBrand}`;
    }
    if (this.priceRange) {
      query += `&maxPrice=${this.priceRange}`;
    }
    this.httpService.getCarByParams(query).subscribe(
      (res: any) => {
        this.dashBoardCardData = res.data.data ? res.data.data : [];
        this.totalRecords = res.data.totalCount;
      },
      (error) => {
        this.dashBoardCardData = [];
      }
    );
  }

  filterButton: string = "pending";

  getParams() {
    this.isMyShowroom = false;
    this.activeRoute.queryParams.subscribe((params: any) => {
      const showroomId = params['showroomId'];
      this.searchText = params['search'];
      this.action = params['action'];
      this.showroomId = showroomId;

      this.searchText != '' ? (this.pageTitle = 'Cars') : '';
      showroomId === localStorage.getItem('showRoomId')
        ? (this.pageTitle = 'My Cars')
        : '';

      if (this.searchText != undefined) {
        this.getSearchCars(this.searchText);
      } else if (this.action === 'recommended') {
        this.pageTitle = 'Recommended Cars';
        this.getRecommendedCars();
      } else {
        this.getAllCars();
      }

      if (
        this.userService.showRoomId === showroomId &&
        this.showroomId !== ''
      ) {
        this.isMyShowroom = true;
      }
    });
  }

  onStatusChange(val: any) {
    console.log(val);
    this.filterButton = val;
    localStorage.setItem('filterButton', this.filterButton)
    const getQuery = `?showroomId=${this.showroomId}&page=${this.currentPage}&pageSize=${this.pageSize}&status=${this.filterButton}`;
    this.httpService.getCarByParams(getQuery).subscribe(
      (res: any) => {
        this.dashBoardCardData = res.data.data ? res.data.data : [];
        this.totalRecords = res.data.totalCount;
      },
      (error) => {
        this.dashBoardCardData = [];
      }
    );
  }

  divTogle: boolean = false;
  filterDiv: boolean = true;

  fuelBtn = 'All';
  selectedFuelBtn(tab: string) {
    this.fuelBtn = tab;
  }
  filterBtn() {
    this.filterDiv = !this.filterDiv;
  }

  getRecommendedCars() {
    let query = '';
    if (this.selectedBrand !== '') {
      query += `&brand=${this.selectedBrand}`;
    }
    if (this.priceRange) {
      query += `&maxPrice=${this.priceRange}`;
    }
    this.httpService.getRecommendedCars(`?page=${this.currentPage}&pageSize=${this.pageSize}${query}`).subscribe((res: any) => {
      this.dashBoardCardData = res.data.cars;
      this.totalRecords = res.data.totalCount;
    }, (err) => {
      console.log(err);
    })
  }

  getSearchCars(text: string) {
    let query = `?search=${text}&page=${this.currentPage}&pageSize=${this.pageSize}`;
    if (this.selectedBrand !== '') {
      query += `&brand=${this.selectedBrand}`;
    }
    if (this.priceRange) {
      query += `&maxPrice=${this.priceRange}`;
    }
    this.httpService.getCarsBySearch(query).subscribe((res: any) => {
      this.dashBoardCardData = res.data.carsWithFavorites;
      this.totalRecords = res.data.totalCount;
    });
  }

  pageChanged(event: number) {
    this.currentPage = event;

    if (this.action === 'recommended') {
      this.getRecommendedCars();
    }

    if (this.showroomId) {
      this.getAllCars();
    }

    if (this.searchText != undefined) {
      this.getSearchCars(this.searchText);
    }
  }

  pageSizeChanged(event: number) {
    this.currentPage = 1;
    this.pageSize = event;
    if (this.action === 'recommended') {
      this.getRecommendedCars();
    }

    if (this.showroomId) {
      this.getAllCars();
    }

    if (this.searchText != undefined) {
      this.getSearchCars(this.searchText);
    }
  }
}
