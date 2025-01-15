import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-edit-show-car-details',
  templateUrl: './edit-show-car-details.component.html',
  styleUrls: ['./edit-show-car-details.component.scss']
})
export class EditShowCarDetailsComponent implements OnInit {
  pageType = '';
  id: string = '';
  uploadCarDetailsForm: FormGroup;

  constructor(
    private activeRoute: ActivatedRoute,
    private http: HttpService
  ) {
    this.activeRoute.data.subscribe((res: any) => {
      this.pageType = res.type
    })

    this.uploadCarDetailsForm = new FormGroup({
      title: new FormControl(''),
      feature: new FormControl(''),
      model: new FormControl(''),
      fueltype: new FormControl(''),
      brand: new FormControl(''),
      location: new FormControl(''),
      milage: new FormControl(''),
      price: new FormControl(''),
      drivetype: new FormControl(''),
      textarea: new FormControl(''),
      carPic: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res: any) => {
      this.pageType = res.mode
      this.id = res.id
      this.getCarDetails(this.id)
    })
  }

  smalCarImage = [
    { image: '../../../assets/imgs/3 koenigsegg car hd wallpaper.jpg' },
    { image: '../../../assets/imgs/35a443321abb9319956d40ef2d024e13.jpg' },
    { image: '../../../assets/imgs/cars-hd-widescreen-high-quality-desktop-wallpaper-preview.jpg' }
  ]
  selectImg = ''
  showSelectImge(tab: string) {
    this.selectImg = tab
  }
  submitCarForm() {



  }

  getCarDetails(id: string) {
    this.http.getCarById(id).subscribe((res) => {
      //console.log(res);
    })
  }
}
