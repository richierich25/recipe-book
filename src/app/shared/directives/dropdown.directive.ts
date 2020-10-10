import { Directive, ElementRef, Renderer2, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit{
  isDropdownOpen = false;

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() { }

  @HostListener('click') click(event: Event) {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.renderer.addClass(this.elRef.nativeElement, 'dummy-dropdown');
      return;
    }
    this.renderer.removeClass(this.elRef.nativeElement, 'dummy-dropdown');
  }
}
