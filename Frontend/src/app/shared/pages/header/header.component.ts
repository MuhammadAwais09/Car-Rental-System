import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UtilsService } from '../../services/utils.service';
import { HttpService } from "../../services/http.service";
import { Roles } from '../../enums/enums';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  searchField = '';
  brands: any[] = [];
  models: any[] = [];
  priceRange = 500;

  @ViewChild('closeButton') closeButton!: ElementRef;

  constructor(
    public userService: UserService,
    private router: Router,
    public _utilService: UtilsService,
    private http: HttpService,
  ) { }
  selectedModalBtn = 'all'

  modalSelectedBtn(tab: string) {
    this.selectedModalBtn = tab
  }

  signIn() {
    this.router.navigate(['/auth/login/user'])
  }

  get profilePic(): string {
    if (localStorage.getItem('token') != null) {
      const user = JSON.parse(localStorage.getItem('user') as string);
      if (user.profilePic !== '' || user.profilePic)
        return this._utilService.getProfileUrl(user.profilePic)
    }
    return this._utilService.getProfileUrl()
  }

  ngOnInit() {
    const role = localStorage.getItem('role')
    if (role === Roles.SUPERADMIN) {
      this.isAdmin = true
    }
  }

  isAdmin = false;
  notification() {
    this.router.navigate(['/notifications']);
    this._utilService.requestPermission();
    this.http.allowNotifications(localStorage.getItem('deviceToken') as string).subscribe((res) => {
      //console.log("Notification added successfully");
    })
  }

  search() {
    this.router.navigate(['/availble-car-for-rent'], { queryParams: { search: this.searchField } });
  }

  opeModal() {
    this.http.getAlBrand().subscribe((res: any) => {
      this.brands = res.data;
    })
    this.setModels();
  }

  setModels() {
    const date = new Date();
    for (let i = 2000; i <= date.getFullYear(); i++) {
      this.models.push(i)
    }
  }

  closeModal() {
    this.closeButton.nativeElement.click();
  }

}
