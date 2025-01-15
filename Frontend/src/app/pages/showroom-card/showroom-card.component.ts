import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Roles } from 'src/app/shared/enums/enums';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-showroom-card',
  templateUrl: './showroom-card.component.html',
  styleUrls: ['./showroom-card.component.scss']
})
export class ShowroomCardComponent {
  @Input() showroom: any = {};

  constructor(
    private router: Router,
    public utilityService: UtilsService
  ) { }

  isAdmin = false
  ngOnInit(): void {
    const role = localStorage.getItem('role');
    if (role === Roles.SUPERADMIN) {
      this.isAdmin = true
    }
  }

  goToShowroom() {
    this.router.navigate(['/availble-car-for-rent'], { queryParams: { showroomId: this.showroom._id } })
  }

  getOneShowroom(id: any) {
    this.router.navigate(['admin/showroom/', id])
  }
}
