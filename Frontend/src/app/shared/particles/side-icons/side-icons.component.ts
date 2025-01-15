import { Component, Input } from '@angular/core';
import { ICONS } from '../../enums/icons';

@Component({
  selector: 'icon',
  templateUrl: './side-icons.component.html',
  styles: [
  ]
})
export class SideIcon {
  @Input() color: string = 'white';
  @Input() icon!: ICONS;
  iconType = ICONS
}
