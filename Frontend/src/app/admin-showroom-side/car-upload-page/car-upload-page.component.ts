import { compileNgModule } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Roles } from 'src/app/shared/enums/enums';
import { HttpService } from 'src/app/shared/services/http.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-car-upload-page',
  templateUrl: './car-upload-page.component.html',
  styleUrls: ['./car-upload-page.component.scss'],
})
export class CarUploadPageComponent implements OnInit {
  models: any[] = [];
  showroomId = localStorage.getItem('showRoomId');
  brand: any[] = [];
  pictures: string[] = [];
  carId: string = '';
  isEditable: boolean = false;
  constructor(
    private httpService: HttpService,
    private toaster: ToastrService,
    private router: Router,
    private http: HttpService,
    public utils: UtilsService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {
    httpService.getAlBrand().subscribe((res: any) => {
      this.brand = res.data;
    });
    this.http.getUserShowroom().subscribe((res: any) => {
      this.userService.showRoomId = res.data?._id;
    });
    this.showroomId = userService.showRoomId;
    this.getLocation()
  }
  uploadCarDetailsForm = new FormGroup({
    title: new FormControl('', Validators.required),
    feature: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
    fuelType: new FormControl('', Validators.required),
    brand: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    mileage: new FormControl('', Validators.required),
    realPrice: new FormControl('', Validators.required),
    driverType: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    pictures: new FormControl([], Validators.required),
    showroomId: new FormControl(this.showroomId),
  });

  isSpinnerLoading = false;

  // Function to handle file change event
  onFileChange(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this.uploadFile(formData);
  }

  uploadFile(formData: FormData) {
    this.http.uploadFile(formData).subscribe({
      next: (resp: any) => {
        const { data } = resp;
        if (data) {
          this.pictures.push(data);
          this.uploadCarDetailsForm
            .get('pictures')
            ?.setValue(this.pictures as any);
        }
      },
    });
  }

  isAdmin = false;
  carStatus: any;
  ngOnInit(): void {
    const role = localStorage.getItem('role');
    if (role === Roles.SUPERADMIN) {
      this.isAdmin = true
    }
    const routeUrl = this.router.url.split('/').length;
    if (routeUrl > 2) {
      this.getParams();
    } else {
      this.isEditable = true;
    }
    this.setModels();
  }

  getParams() {
    this.activatedRoute.params.subscribe((params: any) => {
      const isEditable = params.isEditable;
      this.carId = params['carId'];
      if (isEditable) this.isEditable = JSON.parse(isEditable);
      if (this.carId) this.getCarById();
    });
  }

  getCarById() {
    this.http.getCarById(this.carId).subscribe((response: any) => {
      const { data } = response;
      this.carStatus = data.status;
      if (data) {
        this.uploadCarDetailsForm.patchValue(data);
        this.pictures = data.pictures;

        if (!this.isEditable) this.uploadCarDetailsForm.disable();
      }
    });
  }

  setModels() {
    const date = new Date();
    for (let i = 2000; i <= date.getFullYear(); i++) {
      this.models.push(i);
    }
  }

  submitCarForm() {
    this.isSpinnerLoading = true;
    if (this.isEditable && this.carId) {
      this.updateCar(this.uploadCarDetailsForm.value);
      return;
    }
    this.httpService
      .uploadCarInShowRoom(this.uploadCarDetailsForm.value)
      .subscribe(
        (res: any) => {
          this.toaster.success(res.message);
          this.goToSuccessPage();
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }

  goToShowroomPage() {
    const showroomId = this.userService.showRoomId;
    this.router.navigate([`availble-car-for-rent`], {
      queryParams: { showroomId: showroomId },
    });
  }

  goToSuccessPage() {
    this.router.navigate(['booking-status-for-car-upload'], {
      replaceUrl: true,
    });
  }

  updateCar(data: any) {
    this.httpService.updateCar(this.carId, data).subscribe((resp: any) => {
      const { data } = resp;
      if (data) {
        this.toaster.success('Car update successfully');
        this.goToSuccessPage();
      } else {
        this.toaster.error('Something went wrong when updating the car');
      }
    });
  }

  deleteImage(index: number) {
    this.pictures.splice(index, 1);
  }

  locations: any[] = [];
  getLocation() {
    this.httpService.getLocation().subscribe(
      (data: any) => {
        this.locations = data.data;
      },
      (error: any) => {
        console.log('Error Getting locations', error);
      }
    );
  }

  updateStatus(status: string) {
    this.http.updateCarStatusAdmin(status, this.carId).subscribe((res: any) => {
      this.toaster.success('Updated Status !');
      this.router.navigate(['/admin/cars'])
    }, (error: any) => {
      this.toaster.error("Error Updating Status !");
    })
  }
}
