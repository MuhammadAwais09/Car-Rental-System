import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import {
  DriverType,
  Feature,
  FuelType,
  OrderStatus,
} from '../../shared/enums/enums';
import { filter, map } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { LogIn } from 'src/app/shared/models/signup';

@Component({
  selector: 'app-selected-rent-car-details',
  templateUrl: './selected-rent-car-details.component.html',
  styleUrls: ['./selected-rent-car-details.component.scss'],
})
export class SelectedRentCarDetailsComponent implements OnInit {
  protected readonly DriverType = DriverType;
  @ViewChild('days') daysForRent!: ElementRef<HTMLInputElement>;
  @ViewChild('closeBtn') closeBtn!: ElementRef;
  carId = '';
  bookingId = '';
  action: string = '';
  actionBntBooking: boolean = false;
  dayInputValueChnage!: number;

  selectedCarDetails: any = {};
  user: any = JSON.parse(localStorage.getItem('user') as string);
  userCnic: string = 'assets/logo/upload-icon.png';
  userCnicBack: string = 'assets/logo/upload-icon.png';
  bookNowBnt: boolean = false;
  suertyCnic: string = 'assets/logo/upload-icon.png';
  suertyCnicBack: string = 'assets/logo/upload-icon.png';
  bookingStatus: string = '';
  totalCost!: number;
  booking: any = {};
  driverType = DriverType;
  featureEnum = Feature;
  statusEnum = OrderStatus;
  fuelType = FuelType;
  isShowRoomOwner = false;
  showPassword: boolean = false;
  showCnfrmPassword: boolean = false;

  carRentForm = new FormGroup({
    TotalCost: new FormControl(0),
    UserCnic: new FormControl('', Validators.required),
    UserCnicPicFront: new FormControl('', Validators.required),
    UserCnicPicBack: new FormControl('', Validators.required),
    GranteeCnic: new FormControl('', Validators.required),
    GranteeCnicPicFront: new FormControl('', Validators.required),
    GranteeCnicPicBack: new FormControl('', Validators.required),

    GranteeName: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    showRoom: new FormControl(''),
    days: new FormControl('', Validators.required),
    GranteePhoneNumber: new FormControl('', Validators.required),
    // GranteeNameCnic: new FormControl('2465432156'),
    Car: new FormControl(''),
  });

  /*================== FORM GROUPS =====================*/
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.toggleCnfrmPasswordVisibility();
  }
  toggleCnfrmPasswordVisibility() {
    this.showCnfrmPassword = !this.showCnfrmPassword;
  }

  login() {
    let logInDTO = new LogIn();
    logInDTO.email = this.loginForm.get('email')?.value;
    logInDTO.password = this.loginForm.get('password')?.value;
    this.http.logIn(logInDTO).subscribe(
      (res: any) => {
        if (res) {
          this.toaster.success(res.message);
          this.userService.userToken = res.data.token;
          localStorage.setItem(
            'showroomUser',
            JSON.stringify(res.data.isShowRoom)
          );
          this.http.viewProfile().subscribe((response: any) => {
            this.user = response.data;
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem(
              'dp',
              this.utils.getProfileUrl(response.data.profilePic)
            );
            this.utils.profilePic = this.utils.getProfileUrl(
              response.data.profilePic
            );
            this.getUserShowroom();
          });
          this.closeBtn.nativeElement.click();
          this.getBookingData(this.bookingId);
        }
      },
      (err) => {
        this.toaster.error(err.error.message);
        //console.log(err);
      }
    );
  }

  getUserShowroom() {
    this.http.getUserShowroom().subscribe((res: any) => {
      this.userService.showRoomId = res.data?._id;
    });
  }

  constructor(
    private activRout: ActivatedRoute,
    private http: HttpService,
    private utils: UtilsService,
    private toaster: ToastrService,
    private router: Router,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.activRout.params.subscribe((res: any) => {
      this.action = res['action'];

      this.carId = res['id'];

      if (res.type === 'car') {
        this.carId = res['id'];

        this.getCarData(this.carId);
      } else {
        this.bookingId = res['id'];

        this.getBookingData(this.bookingId);
      }
    });
    // const userId = JSON.parse(localStorage.getItem('user') || '{}');
  }

  getCarData(id: string) {
    this.http.getCarById(this.carId).subscribe((res: any) => {
      this.selectedCarDetails = res.data;
      this.selectedCarImg = this.selectedCarDetails.pictures[0];
      this.carRentForm.get('Car')?.setValue(this.selectedCarDetails._id);
      this.carRentForm
        .get('showRoom')
        ?.setValue(this.selectedCarDetails.showroomId);
      this.carRentForm.get('status')?.setValue('pending');
      this.getBrand(this.selectedCarDetails.brand);
    });
  }

  userData = {
    name: this.user.name,
    email: this.user.email,
    userPhoneNumber: this.user.phoneNumber
  }

  getBookingData(id: string) {
    this.http.getBookingById(id).subscribe((res: any) => {
      this.bookingStatus = res.data.status;
      this.bookNowBnt = true;
      this.selectedCarDetails = res.data.Car;
      this.booking = res.data;
      this.selectedCarImg = this.selectedCarDetails.pictures[0];
      this.userData.email = res.data.user.email;
      this.userData.name = res.data.user.firstName + ' ' + res.data.user.lastName;
      this.userData.userPhoneNumber = res.data.user.phoneNumber
      // BRAND SELECTION

      if (this.action === 'view') {
        this.carRentForm.patchValue(this.booking);
        this.carRentForm.disable();
        this.isShowRoomOwner =
          res.data.showRoom === localStorage.getItem('showRoomId');
        this.bookNowBnt = true;
        this.userCnic = this.utils.getFile(this.booking.UserCnicPicFront);
        this.userCnicBack = this.utils.getFile(this.booking.UserCnicPicBack);
        this.suertyCnic = this.utils.getFile(this.booking.GranteeCnicPicFront);
        this.suertyCnicBack = this.utils.getFile(
          this.booking.GranteeCnicPicBack
        );
        const days = this.booking.TotalCost / this.booking.Car.realPrice;
        this.daysForRent.nativeElement.value = days.toString();
      }
    });
  }

  getBrand(id: string) {
    this.http
      .getAlBrand()
      .pipe(
        map((data: any) => {
          const brands = data.data;
          return brands.find((item: any) => item._id === id);
        })
      )
      .subscribe((res) => {
        this.selectedCarDetails.brand = res.name;
      });
  }

  countTotalCost(event: any) {
    let value = event.target.value;
    // if(value > 0){
    //   this.totalCost = +  value * this.selectedCarDetails.realPrice

    //   this.carRentForm.get('TotalCost')?.setValue(this.totalCost)
    // } else {
    //   event.target.value = 1;
    // }
    this.totalCost = +value * this.selectedCarDetails.realPrice;
    this.carRentForm.get('TotalCost')?.setValue(this.totalCost);
  }

  smalCar = [
    { img: 'assets/imgs/bmw-cars-car-sport-car-wallpaper-preview.jpg' },
    { img: 'assets/imgs/3 koenigsegg car hd wallpaper.jpg' },
    {
      img: 'assets/imgs/cars-hd-widescreen-high-quality-desktop-wallpaper-preview.jpg',
    },
  ];

  checkAllValuesFilled(formGroup: FormGroup): boolean {
    let allValuesFilled = true;

    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      
      if (!control || control.value === null || control.value === undefined || control.value === '' || control.invalid) {
        allValuesFilled = false;
      }
    });

    const imageKeys = ['UserCnicPicFront', 'UserCnicPicBack', 'GranteeCnicPicFront', 'GranteeCnicPicBack'];
    imageKeys.forEach((key) => {
      const imgElement = document.querySelector(`img[id="${key}"]`) as HTMLImageElement;
      if (imgElement && !imgElement.src.startsWith('https://')) {
        allValuesFilled = false;
      }
    });

    return allValuesFilled;
  }


  selectedCarImg: string = '';
  createOrder(): any {
    this.carRentForm.markAllAsTouched();
    const isAllValuesFilled = this.checkAllValuesFilled(this.carRentForm);
    if (!isAllValuesFilled || this.totalCost <= 0 || this.totalCost === undefined) {
      return this.toaster.error('Enter All Fields !');
    }

    this.http.createBooking(this.carRentForm.value).subscribe(
      (res: any) => {
        this.toaster.success(res.message);
        this.router.navigate(['/booking-status-for-car-rent'], {
          replaceUrl: true,
        });
      },
      (err) => {
        this.toaster.error(err.error.message);
      }
    );
  }

  selectCarImg(event: any) {
    this.selectedCarImg = event;
  }

  onUserCnicFront(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this.uploadUserFrontCnic(formData);
  }

  uploadUserFrontCnic(formData: FormData) {
    this.http.uploadFile(formData).subscribe({
      next: (resp: any) => {
        const { data } = resp;
        if (data) {
          this.userCnic = this.utils.getFile(data);
          this.toaster.success('Your CNIC Front Pic uploaded Successfully');
          this.carRentForm.get('UserCnicPicFront')?.setValue(data);
        }
      },
      error: (error: any) => {
        //console.log(error, 'error');
      },
    });
  }
  onUserCnicBack(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this.uploadUserBackCnic(formData);
  }
  uploadUserBackCnic(formData: FormData) {
    this.http.uploadFile(formData).subscribe({
      next: (resp: any) => {
        const { data } = resp;
        if (data) {
          this.userCnicBack = this.utils.getFile(data);
          this.toaster.success('Your CNIC Back Pic uploaded Successfully');
          this.carRentForm.get('UserCnicPicBack')?.setValue(data);
        }
      },
      error: (error: any) => {
        //console.log(error, 'error');
      },
    });
  }

  onGuaranteeCnic(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this.uploadGuaranteeCnic(formData);
  }

  uploadGuaranteeCnic(formData: FormData) {
    this.http.uploadFile(formData).subscribe({
      next: (resp: any) => {
        const { data } = resp;
        if (data) {
          this.suertyCnic = this.utils.getFile(data);
          this.toaster.success('Surety CNIC Front Pic uploaded Successfully');
          this.carRentForm.get('GranteeCnicPicFront')?.setValue(data);
        }
      },
      error: (error: any) => {
        //console.log(error, 'error');
      },
    });
  }

  onGuaranteeCnicback(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this.uploadGuaranteeBackCnic(formData);
  }
  uploadGuaranteeBackCnic(formData: FormData) {
    this.http.uploadFile(formData).subscribe({
      next: (resp: any) => {
        const { data } = resp;
        if (data) {
          this.suertyCnicBack = this.utils.getFile(data);
          this.toaster.success('Surety CNIC Back Pic uploaded Successfully');
          this.carRentForm.get('GranteeCnicPicBack')?.setValue(data);
        }
      },
      error: (error: any) => {
        //console.log(error, 'error');
      },
    });
  }
  getImageUrl(url: string): string {
    return this.utils.getFile(url);
  }
  updateStatus(status: string) {
    const obj = {
      status: status,
      booking: this.carId,
    };
    this.http.updateBookingOrder(obj).subscribe((res: any) => {
      this.toaster.success(res.message);
      this.router.navigate(['/'])
    });
  }
}
