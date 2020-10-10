import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown2]'
})
export class Dropdown2Directive {
  // class `dummy2` will be added based on the truthy nature of the isDropdownOpen
  @HostBinding('class.dummy2') isDropdownOpen = false;

  constructor() { }

  // @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
  //   this.isDropdownOpen = this.elRef.nativeElement.contains(event.target) ? !this.isDropdownOpen : false;
  // }
  @HostListener('click') click(event: Event) {
    this.isDropdownOpen = !this.isDropdownOpen;
    return;
  }
}
