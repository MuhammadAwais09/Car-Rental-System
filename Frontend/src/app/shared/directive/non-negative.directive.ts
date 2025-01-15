import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[nonNegative]'
})
export class NonNegativeDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    let inputValue: any = inputElement?.value?.replace(/\D/g, ''); // Remove non-digit characters

    // Ensure inputValue is a non-negative integer
    if (!isNaN(inputValue) && parseInt(inputValue) >= 1) {
      inputElement.value = inputValue;
    } else {
      inputElement.value = '';
    }


    
  }

}
