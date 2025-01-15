import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../services/http.service';
import { Profile } from '../../models/signup';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.scss']
})
export class ProfileSectionComponent implements OnInit {

  constructor(
    private _userService: UserService, 
    private _utilsService: UtilsService, 
    private http: HttpService, 
    private toaster: ToastrService,
    private router: Router,
    public utilService: UtilsService
    ) { }

  profilePicLocal: string = 'assets/imgs/profile.webp'
  user: Profile = new Profile();
  validate: any;
  cities: any;
  showDropdown = {
    gender: false,
    location: false,
  }
  currentOption: any = {
    gender: '',
    location: ''
  }
  customTouch = {
    gender: false,
    location: false,
  }
  siteInfo: any;

  ngOnInit(): void {
    this.getProfile()
  }

  triggerOptions(type: any) {
    if (type === 'gender') {
      this.showDropdown.gender = !this.showDropdown.gender;
      if (!this.showDropdown.gender)
        this.customTouch.gender = true;
    } else {
      this.showDropdown.location = !this.showDropdown.location;
      if (!this.showDropdown.location)
        this.customTouch.location = true;
    }
  }

  getProfile() {
    this.http.viewProfile().subscribe((res: any) => {
      this.user = res.data
      if (this.user.profilePic !== undefined)
      this.profilePicLocal = this.http.liveAssetUrl + this.user.profilePic
    })
  }

  handleUpload(event: any) {
    const file = event.target.files[0];
    
    // Check file type and dimensions
    if (!this.validateFile(file)) {
      // Handle invalid file
      this.toaster.error('Please upload a JPG, JPEG, or PNG file with dimensions between 400px and 1024px.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    this.http.uploadFile(formData).subscribe({
      next: (resp: any) => {
        this.user.profilePic = resp.data;
        this.profilePicLocal = this.http.liveAssetUrl + resp.data;
        localStorage.setItem('dp', this.utilService.getProfileUrl(resp.data));
        this.toaster.success('Profile image uploaded successfully!');
      }
    });
  }
  
  validateFile(file: File): any {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const minWidth = 400;
    const maxWidth = 1024;
  
    if (!allowedTypes.includes(file.type)) {
      return false; // Invalid file type
    }
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const image = new Image();
        image.onload = () => {
          if (image.width < minWidth || image.width > maxWidth) {
            resolve(false); // Invalid dimensions
          } else {
            resolve(true); // Valid file
          }
        };
        image.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  

  updateProfile() {
    this.http.updateProfile(this.user).subscribe((res: any) => {
      this.toaster.success(res.message);
      localStorage.setItem('dp', this._utilsService.getProfileUrl(res.data.profilePic));
      this._utilsService.profilePic = this._utilsService.getProfileUrl(res.data.profilePic)
    })
  }

  logout(){
    this._userService.logout()
    this.router.navigate(['/'])
  }



}
