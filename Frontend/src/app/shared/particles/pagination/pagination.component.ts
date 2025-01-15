import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>;
  @Output() pageSizeChanged: EventEmitter<number> = new EventEmitter<number>;
  @Input() paginationId: string = '';

  pageChangedFn (event: number) {
    this.pageChanged.emit(event);
  }

  pageSizeChangedFn (event: any) {
    this.pageSizeChanged.emit(event.target.value);
  }
}
