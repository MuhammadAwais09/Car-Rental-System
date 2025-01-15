import { Component } from '@angular/core';

@Component({
  selector: 'app-orderd-car-details',
  templateUrl: './orderd-car-details.component.html',
  styleUrls: ['./orderd-car-details.component.scss']
})
export class OrderdCarDetailsComponent {
  smalCarImage = [
    { image: '../../../assets/imgs/3 koenigsegg car hd wallpaper.jpg' },
    { image: '../../../assets/imgs/35a443321abb9319956d40ef2d024e13.jpg' },
    { image: '../../../assets/imgs/cars-hd-widescreen-high-quality-desktop-wallpaper-preview.jpg' }
  ]
  selectImg = ''
  showSelectImge(tab: string) {
    this.selectImg = tab
  }
}
