import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Roles, ShowroomStatus } from 'src/app/shared/enums/enums';
import { AddShoowRoom } from 'src/app/shared/models/showRoom';
import { HttpService } from 'src/app/shared/services/http.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-enter-showroom-details',
  templateUrl: './enter-showroom-details.component.html',
  styleUrls: ['./enter-showroom-details.component.scss'],
})
export class EnterShowroomDetailsComponent implements OnInit {
  showRoomDTTO = new AddShoowRoom();
  editShowroom: string = '';
  showroomDetails: any = {};
  saveBtnText = 'Save';
  locations: any[] = [];
  showroomStatus: ShowroomStatus = ShowroomStatus.PENDING;
  showroomStatusEnum = ShowroomStatus;
  statusDescLine = '';

  constructor(
    private httpService: HttpService,
    private toaster: ToastrService,
    private router: Router,
    private utils: UtilsService,
    private activeRoute: ActivatedRoute,
    public userService: UserService
  ) { }

  showRoomForm = new FormGroup({
    showRoomName: new FormControl('', Validators.required),
    owner: new FormControl(''),
    rentType: new FormControl(''),
    phone: new FormControl('', Validators.required),
    showRoomPicture: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
  });

  id: any
  isAdmin = false
  isPending = false;
  ngOnInit(): void {
    const role = localStorage.getItem('role');
    const filter = localStorage.getItem('filter');
    if (filter === 'pending') {
      this.isPending = true
    }
    if (role === Roles.SUPERADMIN) {
      this.isAdmin = true
    }

    this.activeRoute.data.subscribe((res: any) => {
      this.editShowroom = res.edit;
      if (this.editShowroom) this.getShowroomDetails();
    });

    this.activeRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      if (this.id) {
        this.getSingleShowroom();
      }
    });

    this.getLocation();
  }

  imageUrl: string | ArrayBuffer | null | undefined = 'assets/logo/upload.png';

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

  onFileChange(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    this.uploadFile(formData);
  }

  uploadFile(formData: FormData) {
    this.httpService.uploadFile(formData).subscribe({
      next: (resp: any) => {
        const { data } = resp;
        if (data) {
          this.imageUrl = this.utils.getFile(data);
          this.showRoomDTTO.showRoomPicture = data;
        }
      },
      error: (error: any) => {
        //console.log(error, 'error');
      },
    });
  }

  getShowroomDetails() {
    this.httpService.getUserShowroom().subscribe((res: any) => {
      const { data } = res;
      this.showroomDetails = res.data;
      this.showRoomForm.patchValue({
        showRoomName: data.showRoomName,
        location: data.location,
        phone: data.phone,
      });
      this.isPending = this.showroomDetails.status === 'pending';
      this.showroomStatus = res.data.status;
      console.log(this.showroomStatus);
      this.imageUrl = this.utils.getFile(data.showRoomPicture);
      if (this.showroomStatus === this.showroomStatusEnum.REJECTED) {
        this.statusDescLine = 'Your application for showroom got rejected. Please retry after updating the content. Thank you';
        this.saveBtnText = 'Resubmit';
      } else if (this.showroomStatus === this.showroomStatusEnum.PENDING) {
        this.statusDescLine = 'Your Showroom is pending for approval please wait until we approve it. We will notify you soon';
      }
    });
  }

  deleteShowroom() {
    this.httpService.deleteShowroom(this.showroomDetails._id).subscribe(
      (res: any) => {
        this.toaster.warning(res.message);
        localStorage.setItem('showroomUser', 'false');
        this.router.navigate(['/']);
      },
      (err) => {
        this.router.navigate(['/']);
        this.toaster.warning(err.error.message);
      }
    );
  }

  isSpinnerLoading = false;
  shoroomValue(): any {
    this.showRoomDTTO.showRoomName = this.showRoomForm.get([
      'showRoomName',
    ])?.value;
    this.showRoomDTTO.phone = this.showRoomForm.get(['phone'])?.value;
    this.showRoomDTTO.location = this.showRoomForm.get(['location'])?.value;

    //console.log(this.imageUrl);
    if (
      !this.showRoomDTTO.location ||
      !this.showRoomDTTO.showRoomName ||
      !this.showRoomDTTO.phone ||
      (!this.showRoomDTTO.showRoomPicture &&
        this.imageUrl == 'assets/logo/upload.png')
    ) {
      return this.toaster.error('Enter All Fields!');
    }

    //console.log(this.showRoomDTTO.showRoomPicture, this.imageUrl);

    this.httpService.addShowRoom(this.showRoomDTTO).subscribe(
      (res: any) => {
        if (res) {
          //console.log(res);
          this.userService.showRoomId = res.data._id;
          localStorage.setItem('showroomUser', 'true');
          this.toaster.success(res.message);
          this.router.navigate(['']);
        }
      },
      (err) => {
        this.toaster.error(err.error.message);
      }
    );
  }

  getSingleShowroom() {
    this.httpService.getShowroomByID(this.id).subscribe((res: any) => {
      const { data } = res;
      this.showroomDetails = res.data;
      this.showRoomForm.patchValue({
        showRoomName: data.showRoomName,
        location: data.location,
        phone: data.phone,
      });

      this.isPending = this.showroomDetails.status === 'pending';
      this.imageUrl = this.utils.getFile(data.showRoomPicture);
      if (this.userService.isAdmin) {
        this.showRoomForm.disable();
      }
      this.showroomStatus = res.data.status;
      if (this.showroomStatus === this.showroomStatusEnum.REJECTED) {
        this.statusDescLine = 'You rejected this showroom';
        this.saveBtnText = 'Resubmit';
      } else if (this.showroomStatus === this.showroomStatusEnum.APPROVED && this.isAdmin) {
        this.statusDescLine = 'You approved this showroom';
      }
    });
  }

  updateStatus(status: any) {
    this.httpService.updateShowroomStatus(this.id, status).subscribe((res: any) => {
      this.router.navigate(['/']);
      this.toaster.success('Status Updated Successfully !')
    }, (error: any) => {
      this.toaster.error('Error updating status !')
    })
  }

}
