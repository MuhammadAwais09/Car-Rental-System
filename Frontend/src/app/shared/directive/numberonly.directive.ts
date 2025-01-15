import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[numberOnly]'
})
export class NumberonlyDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    let inputValue: any = inputElement?.value?.replace(/[^0-9-]/g, ''); // Remove non-numeric characters

    inputElement.value = inputValue;
  }

}
