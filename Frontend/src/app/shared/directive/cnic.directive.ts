import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCnic]'
})
export class CnicDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    let inputValue: any = inputElement?.value?.replace(/[^0-9-]/g, ''); // Remove non-numeric characters

    if (inputValue.length <= 5) {
      inputValue = inputValue; // Format for less than 5 characters
    }
     else if (inputValue.length <= 12) {
      let firstFive = inputValue.substr(0,5);
      let remaining = inputValue.slice(5,inputValue.length);    
      //console.log('firstfive', firstFive);
      //console.log('remaining', remaining);
        
      inputValue =  firstFive.concat('-', remaining) // Format for 12 characters
    } else if (inputValue.length <= 12) {
      inputValue = '31303-' + inputValue.substring(5, 12) + '-'; // Format for 12 characters
    }

    inputElement.value = inputValue;
  }

}
